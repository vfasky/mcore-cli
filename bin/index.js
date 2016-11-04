#!/usr/bin/env node

/**
* mcore-cli 生成 mcore3 项目
* @date 2016-10-06 12:34:54
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/

'use strict'

var fs = require('fs-plus')
var path = require('path')
var yargs = require('yargs')
var colors = require('colors')
var generateTpl = require('../lib/componentTpl/')

// init project
yargs.command(['init [dir]', 'i'], 'Init a mcore3 project', {
    lang: {
        alias: 'l',
        describe: 'The language that the project used.',
        choices: ['es6'],
        default: 'es6'
    },

    name: {
        alias: 'n',
        describe: 'The project name ',
        default: 'mcore-app'
    },

    port: {
        alias: 'p',
        describe: 'The http port that the project used',
        default: '3000'
    },

    desc: {
        describe: 'The brief introduction of project',
        default: 'A mcore3 project'
    },

    help: {
        alias: 'h'
    }

}, function (args) {
    // 复制模板目录
    var sourePath = path.join(__dirname, '../tpl/' + args.lang)
    var outPath = args.dir || './'

    outPath = path.join(process.cwd(), outPath)

    console.log('Copy tpl folder: begin')
    fs.copySync(sourePath, outPath)
    console.log('Copy tpl folder: end')

    // 复制 tool
    console.log('Copy tool')
    fs.copySync(path.join(__dirname, '../tool'), path.join(outPath, './tool'))

    // 生成 package.json
    var packageJsonTpl = require('../tpl/package.tpl.json')
    var beauty = require('js-beautify').js_beautify
    packageJsonTpl.name = args.name

    // npm scripts
    if (packageJsonTpl.scripts &&
        packageJsonTpl.scripts.dev &&
        packageJsonTpl.scripts.dev.indexOf('PORT') < 0) {
        // dev 模式指定端口
        packageJsonTpl.scripts.dev = 'PORT=' + args.port + ' ' + packageJsonTpl.scripts.dev
    }

    // 生成依赖
    if (args.type === 'es6') {
        packageJsonTpl.scripts.fix = 'eslint src/**/*.es6 --fix'
        Object.assign(packageJsonTpl.devDependencies, {
            'babel-core': '^6.0.0',
            'babel-eslint': '^6.1.2',
            'babel-loader': '^6.0.0',
            'babel-plugin-transform-runtime': '^6.0.0',
            'babel-preset-es2015': '^6.0.0',
            'babel-preset-es2015-ie': '^6.6.2',
            'babel-preset-stage-2': '^6.0.0',
            'eslint': '^3.7.1',
            'eslint-config-standard': '^6.2.0',
            'eslint-plugin-promise': '^2.0.1',
            'eslint-plugin-standard': '^2.0.1',
            'eslint-plugin-html': '^1.5.3'
        })
    }

    console.log('Copy package.json')
    fs.writeFileSync(
        path.join(outPath, 'package.json'),
        beauty(JSON.stringify(packageJsonTpl)),
        'utf8')

    // 生成 readme
    var readmeTpl = fs.readFileSync(path.join(__dirname, '../tpl/README.tpl.md'), 'utf8')
    readmeTpl = readmeTpl.replace(/\${(\w+)}/gi, function (match, name) {
        return args[name] ? args[name] : ''
    })
    console.log('Generate read me')
    fs.writeFileSync(path.join(outPath, 'README.md'), readmeTpl, 'utf8')

    console.log(colors.green('All done'))
})
.command(['add <componentName>', 'a'], 'Add a component to project', {
    lang: {
        alias: 'l',
        describe: 'The language that the project used.',
        choices: ['es6'],
        default: 'es6'
    },

    type: {
        alias: 't',
        describe: 'The component type',
        choices: ['view', 'ui', 'tag', 'binder', 'formatter'],
        default: 'view'
    },

    path: {
        alias: 'p',
        describe: 'The src root path',
        default: './src'
    },

    help: {
        alias: 'h'
    }
}, function (args) {
    // 检查是否有 package.json
    if (!fs.existsSync(path.join(process.cwd(), './package.json'))) {
        console.log(colors.red('error: It\'s not a mcore3 project root.'))
        return false
    }

    let componentPath = args.componentName
    let componentName = componentPath.substr(componentPath.lastIndexOf('/') + 1)
    let ComponentName = componentName[0].toLocaleUpperCase() + componentName.substr(1)
    let componentCssName = componentName.split(/(?=[A-Z])/)
        .map(str => { return str.toLocaleLowerCase() })
        .join('-')

    if (args.type === 'formatter' || args.type === 'binder') {
        args.type += 's'
        componentPath = path.join(process.cwd(), args.path, args.type)
    } else {
        componentPath = path.join(process.cwd(), args.path, args.type, componentPath)
    }

    componentName = componentName[0].toLocaleLowerCase() + componentName.substr(1)

    let componentRoutePath = args.componentName.replace('.', '')

    // console.log(componentName, ComponentName, componentCssName, args.componentName, componentRoutePath)
    generateTpl(args.type, args.lang, componentPath, {
        componentName: componentName,
        ComponentName: ComponentName,
        componentCssName: componentCssName,
        componentPath: componentRoutePath
    })
})
.version(function () {
    return require('../package.json').version
})
.alias('version', 'v')
.help()
.argv

