/**
 *
 * webpack config
 **/
"use strict";

require('coffee-script/register');

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackDevServer = require('webpack-dev-server');

const CleanPlugin = require('clean-webpack-plugin');
const ChangeFilesPlugin = require('mcore-cli/tool/webpack/changeFilesPlugin');
const BuildHtml = require('mcore-cli/tool/webpack/buildHtmlPlugin');

process.env.ENV = process.env.ENV || 'dev';
process.env.PORT = process.env.PORT || 8080;

// dev server host
const devHost = 'http://localhost:'+ process.env.PORT +'/';

let config = {
    staticPath: '/',
    env: process.env.ENV,
    entry: {
        app: path.join(__dirname, 'src/app/app'),
        vendor: [
            'jquery',
            'mcore3',
            path.join(__dirname, 'src/sass/app.scss'),
        ]
    },
    output: {
        path: path.join(__dirname, 'dist', process.env.ENV),
        filename: '[name].js',
        chunkFilename: '[name].js',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [{
            test: /\.coffee$/,
            loader: "coffee-loader"
        }, {
            test: /\.tpl$/,
            loader: path.resolve(__dirname, 'node_modules/mcore3/dist/h2svd-loader.js')
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'url?limit=10000&name=images/[hash:8].[name].[ext]'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url?limit=10000&name=font/[hash:8].[name].[ext]&mimetype=application/font-woff"
        }, {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url?limit=10000&name=font/[hash:8].[name].[ext]"
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract([
                'css?sourceMap',
                'postcss?sourceMap',
                'sass?config=sassConfig&sourceMap'
            ])
        }, {
            test: /jquery[!mcore]/,
            loader: 'expose?$!expose?jQuery'
        }]
    },
    postcss: function() {
        return [
            require('autoprefixer')({
                browsers: ['last 2 versions']
            }),
            require('postcss-assets')({
                relative: true,
                loadPaths: ['./images'],
            }),
            require('postcss-at2x')(),
        ];
    },
    sassConfig: {

        includePaths: [
            require('bourbon').includePaths,
            path.join(__dirname, 'node_modules'),
        ]
    },
    resolve: {
        extensions: ['', '.coffee', '.js'],

        modulesDirectories: [
            path.join(__dirname, 'node_modules')
        ],

        alias: {
            env: path.join(__dirname, 'src/env', process.env.ENV),
        }
    },
    externals: {

    },
    devtool: "source-map",
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
        }),
        new DashboardPlugin(),
        new BuildHtml({
            tplPath: path.join(__dirname, 'outTpl'),
            outPath: path.join(__dirname),
            varMap: {
                staticPath: function() {
                    return config.staticPath;
                },
                env: function() {
                    return config.env;
                },
            }
        }),
    ]
};

config.buildEnv = function(envName, staticPath) {

    //静态资源域名
    config.staticPath = staticPath || '/';

    config.devtool = '';

    config.env = envName;

    config.sassConfig.outputStyle = 'compressed';

    config.output.publicPath = config.staticPath + 'dist/' + envName + '/';
    config.output.path = path.join(__dirname, 'dist/' + envName);
    config.output.filename = '[name].[chunkhash].js';
    config.output.chunkFilename = '[name].[chunkhash].js';

    config.resolve.alias.env = path.join(__dirname, 'src/env/' + envName);

    config.plugins.push(new ExtractTextPlugin('style/css/[name].[contenthash:8].css'));
    config.plugins.push(new CleanPlugin('dist/dev'));
    config.plugins.push(new CleanPlugin('dist/' + envName));

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    return config;
};

console.log('build ' + process.env.ENV);
console.log('----------------------------');

switch (process.env.ENV) {
    case 'sit':
    case 'uat':
    case 'deploy':
        module.exports = config.buildEnv(process.env.ENV);
        break;
    default:
        // webpack-dev-server
        config.output.publicPath = devHost + 'dist/' + process.env.ENV + '/';
        config.plugins.push(new OpenBrowserPlugin({
            url: devHost
        }));
        config.plugins.push(new ExtractTextPlugin('style/[name].css'));

        config.plugins.push(
            new ChangeFilesPlugin()
        );

        config.entry.vendor.push(path.join(__dirname, 'node_modules/mcore-cli/tool/webpack/wdsClient'));
        let compiler = webpack(config);

        WebpackDevServer.prototype.socketSendData = function(sockets, stats, force, type, data){
            this._sendStats(sockets, stats, force);
            this.sockWrite(this.sockets, type, data);
        };

        let server = new WebpackDevServer(compiler,{
            // compress: true,
            publicPath: config.output.publicPath,
            stats: {
    			colors: true
    		}
        });
        compiler._server = server;
        // console.log(compiler);
        server.listen(process.env.PORT);
}
