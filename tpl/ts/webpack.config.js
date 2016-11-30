/**
 *
 * webpack config
 **/
'use strict'

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const WebpackDevServer = require('webpack-dev-server')

const CleanPlugin = require('clean-webpack-plugin')
const ChangeFilesPluginESM = require('./tool/webpack/changeFilesPlugin.js')
const BuildHtmlESM = require('./tool/webpack/buildHtmlPlugin.js')

const ChangeFilesPlugin = ChangeFilesPluginESM['default']
const BuildHtml = BuildHtmlESM['default']

process.env.ENV = process.env.ENV || 'dev'
process.env.PORT = process.env.PORT || 3000

// dev server host
const devHost = 'http://localhost:' + process.env.PORT + '/'

let config = {
    staticPath: '/',
    env: process.env.ENV,
    entry: {
        app: path.join(__dirname, './src/app/app'),
        vendor: [
            'jquery',
            'mcore3',
            path.join(__dirname, './src/sass/app.scss')
        ]
    },
    output: {
        path: path.join(__dirname, 'dist', process.env.ENV),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }, {
            test: /\.tpl$/,
            loader: path.resolve(__dirname, './node_modules/mcore3/dist/h2svd-loader.js')
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'url?limit=2048&name=images/[hash:8].[name].[ext]'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url?limit=2048&name=font/[hash:8].[name].[ext]&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url?limit=2048&name=font/[hash:8].[name].[ext]'
        }, {
            test: /\.scss$/,
            include: path.join(__dirname, './src'),
            loader: ExtractTextPlugin.extract([
                'css',
                'postcss',
                'sass?config=sassConfig'
            ])
        }, {
            test: /jquery[!mcore]/,
            loader: 'expose?$!expose?jQuery'
        }]
    },
    ts: {
        logLevel: 'error',
        silent: true,
        transpileOnly: true
    },
    postcss: function () {
        return [
            require('autoprefixer')({
                browsers: ['last 2 versions']
            }),
            require('postcss-assets')({
                relative: true,
                loadPaths: ['./images']
            }),
            require('postcss-at2x')()
        ]
    },
    sassConfig: {
        includePaths: [
            path.resolve('./src/sass'),
            require('bourbon').includePaths,
            path.join(__dirname, './node_modules')
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules', './src'],
        extensions: ['', '.es6', '.js', '.ts', '.coffee', '.scss'],
        alias: {
            env: path.join(__dirname, './src/env', process.env.ENV),
            svg: path.resolve('./svg/dist/svg')
        }
    },
    externals: {

    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new BuildHtml({
            tplPath: path.join(__dirname, './outTpl'),
            outPath: path.join(__dirname, './'),
            varMap: {
                staticPath: function () {
                    return config.staticPath
                },
                env: function () {
                    return config.env
                }
            }
        })
    ]
}

config.buildEnv = function (envName, staticPath) {
    // 静态资源域名
    config.staticPath = staticPath || '/'

    config.devtool = ''

    config.env = envName

    config.sassConfig.outputStyle = 'compressed'

    config.output.publicPath = config.staticPath + 'dist/' + envName + '/'
    config.output.path = path.join(__dirname, './dist/' + envName)
    config.output.filename = '[name].[chunkhash].js'
    config.output.chunkFilename = '[name].[chunkhash].js'

    config.resolve.alias.env = path.join(__dirname, './src/env/' + envName)

    config.plugins.push(new ExtractTextPlugin('style/[name].[contenthash:8].css'))
    config.plugins.push(new CleanPlugin('./dist/dev'))
    config.plugins.push(new CleanPlugin('./dist/' + envName))

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    )

    return config
}

console.log('build ' + process.env.ENV)
console.log('----------------------------')

switch (process.env.ENV) {
    case 'sit':
    case 'uat':
    case 'deploy':
        module.exports = config.buildEnv(process.env.ENV)
        break
    default:
        // webpack-dev-server
        config.output.publicPath = devHost + 'dist/' + process.env.ENV + '/'
        config.plugins.push(new ExtractTextPlugin('style/[name].css'))

        if (process.env.BUILD) {
            console.log('---- BUILD -----');
            module.exports = config
            return
        }

        config.plugins.push(new OpenBrowserPlugin({
            url: devHost
        }))
        config.plugins.push(new ChangeFilesPlugin())
        config.plugins.push(new DashboardPlugin())

        config.entry.vendor.push(path.join(__dirname, './tool/webpack/wdsClient'))
        let compiler = webpack(config)

        WebpackDevServer.prototype.socketSendData = function (sockets, stats, force, type, data) {
            this._sendStats(sockets, stats, force)
            this.sockWrite(this.sockets, type, data)
        }

        let server = new WebpackDevServer(compiler, {
            // compress: true,
            contentBase: './',
            publicPath: config.output.publicPath,
            stats: {
                colors: true
            }
        })

        compiler._server = server
        // console.log(compiler);
        server.listen(process.env.PORT)
}
