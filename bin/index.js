#!/usr/bin/env node


/**
* mcore-cli 生成 mcore3 项目
* @date 2016-10-06 12:34:54
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/


'use strict';

var fs = require('fs-plus');
var path = require('path');

// 参数配置
var args = require('yargs')
    .alias('i', 'init')
    .describe('i', '初始化项目，可以指定某个目录作为项目根目录')
    .example('i', 'mcore-cli -i ./mcore-app')
    .default('i', './')

    .alias('t', 'type')
    .describe('t', '项目类型，es6 或者 coffee')
    .default('t', 'es6')

    .alias('v', 'version')
    .describe('v', "查看版本")

    .alias('n', 'name')
    .describe('n', '项目名称')
    .default('n', 'mcore-app')

    .alias('p', 'port')
    .describe('p', '项目运行的端口')
    .default('p', '3000')

    .alias('h', 'help')

    .describe('desc', '项目简介')
    .default('desc', 'A mcore3 project')

    .usage('Usage: mcore-cli --init [dir] --type es6')
    .demand(['init'])
    .help('h')
    .argv
    ;

// 显示 mcore-clic 版本
var cliPackage = require('../package.json');

if (args.version) {
    console.log(cliPackage.version);
    return false;
}

// 复制模板目录
var outPath = path.join(process.cwd(), args.i);
var sourePath = path.join(__dirname, '../tpl/' + args.type);
console.log('复制模板目录 begin');
fs.copySync(sourePath, outPath);
console.log('复制模板目录 end');


// 复制 tool
console.log('复制 tool');
fs.copySync(path.join(__dirname, '../tool'), path.join(outPath, './tool'));

// 生成 package.json
var packageJsonTpl = require('../tpl/package.tpl.json');
var beauty = require('js-beautify').js_beautify;
packageJsonTpl.name = args.name;

// npm scripts
if (packageJsonTpl.scripts &&
    packageJsonTpl.scripts.dev &&
    packageJsonTpl.scripts.dev.indexOf('PORT') < 0) {

    // dev 模式指定端口
    packageJsonTpl.scripts.dev = "PORT=" + args.port + " " + packageJsonTpl.scripts.dev;
}

// 生成依赖
if (args.type == 'es6') {
    Object.assign(packageJsonTpl, {
        "babel-core": "^6.0.0",
        "babel-eslint": "^6.1.2",
        "babel-loader": "^6.0.0",
        "babel-plugin-transform-runtime": "^6.0.0",
        "babel-preset-es2015": "^6.0.0",
        "babel-preset-es2015-ie": "^6.6.2",
        "babel-preset-stage-2": "^6.0.0",
    });
}

console.log('生成 package.json');
fs.writeFileSync(
    path.join(outPath, 'package.json'),
    beauty(JSON.stringify(packageJsonTpl)),
    'utf8');

// 生成 readme
var readmeTpl = fs.readFileSync(path.join(__dirname, '../tpl/README.tpl.md'), 'utf8');
readmeTpl = readmeTpl.replace(/\${(\w+)}/gi, function(match, name) {
    return args[name] ? args[name] : '';
});
console.log('生成 readme');
fs.writeFileSync(path.join(outPath, 'README.md'), readmeTpl, 'utf8');

console.log('All done');