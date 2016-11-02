const path = require('path')
// const webpack = require('webpack')
const SvgStore = require('webpack-svgstore-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const buildSVGHtml = require('./tool/webpack/buildSVGHtml').default

module.exports = {
    entry: {
        svg: path.resolve('./svg/index.js')
    },

    output: {
        path: path.resolve('./svg/dist'),
        publicPath: '/',
        filename: '[name].js'
    },

    plugins: [
        new CleanPlugin('./images/svg'),
        new SvgStore({
            prefix: 'svg-',
            svgoOptions: {
                plugins: [
                    {
                        removeAttrs: {
                            attrs: ['fill', 'stroke', 'sketch:type', 'id']
                        }
                    },
                    {
                        removeTitle: true
                    },
                    {
                        removeStyleElement: true
                    }
                ]
            }
        }),
        function () {
            buildSVGHtml(path.resolve('svg/dist/icons.html'), path.resolve('svg/src'))
        }
    ]
}

