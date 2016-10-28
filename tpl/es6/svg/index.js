var __svg__ = {
    path: './src/**/*.svg',
    name: '../../images/svg/sprite.[hash].svg'
}

require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__)
