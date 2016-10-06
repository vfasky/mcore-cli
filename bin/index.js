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

    .usage('Usage: mcore-cli --init [dir] --type es6')
    .demand(['init'])
    .help('h')
    .argv
    ;

// 复制模板目录
var outPath = path.join(process.cwd(), args.i);
var sourePath = path.join(__dirname, '../tpl/' + args.type);
fs.copySync(sourePath, outPath);

// 生成 package.json
var packageJsonTpl = require('../tpl/package.tpl.json');
packageJsonTpl.name = args.name;

// npm scripts
if (packageJsonTpl.scripts &&
    packageJsonTpl.scripts.dev &&
    packageJsonTpl.scripts.dev.indexOf('PORT') < 0) {

    // dev 模式指定端口
    packageJsonTpl.scripts.dev = "PORT=" + args.port + " " + packageJsonTpl.scripts.dev;
}
console.log('writeFile', packageJsonTpl);

// 显示 mcore-clic 版本
var cliPackage = require('../package.json');

if (args.version) {
    console.log(cliPackage.version);
}