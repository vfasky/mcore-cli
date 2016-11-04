/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../definition/fs-plus.d.ts" />
/**
 * build html for webpack plugin
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var fs = require('fs-plus');
var path = require('path');
var glob = require('glob');
var nunjucks = require('nunjucks');
var chokidar = require('chokidar');
/**
 * 取所有模板列表
 * @param tplPath 模板目录
 * @param outPath 输出目录
 */
function getDep(tplPath, outPath) {
    // 读模板文件
    var tplFiles = glob.sync(path.join(tplPath, '**/*.html'));
    var data = [];
    tplFiles.forEach(function (htmlFile) {
        var relative = path.relative(tplPath, htmlFile);
        var baseName = path.basename(htmlFile);
        // 忽略以 _ 开头的文件名
        if (baseName.indexOf('_') !== 0) {
            data.push({
                soure: htmlFile,
                relative: relative,
                out: path.join(outPath, relative)
            });
        }
    });
    return data;
}
/**
 * BuildHtml
 */
var BuildHtml = (function () {
    function BuildHtml(options) {
        var _this = this;
        this.tplPath = options.tplPath;
        this.outPath = options.outPath;
        this.varMap = options.varMap || {};
        this.filters = options.filters || {};
        this.stats = null;
        this.buildCallback = options.callback || function () { };
        this.template = nunjucks.configure(this.tplPath, {
            autoescape: false,
            noCache: true
        });
        Object.keys(this.filters).forEach(function (name) {
            _this.template.addFilter(name, _this.filters[name]);
        });
        this.watch();
    }
    BuildHtml.prototype.apply = function (compiler) {
        var _this = this;
        this.compiler = compiler;
        compiler.plugin('done', function (stats) {
            _this.stats = stats;
            _this.build();
        });
    };
    BuildHtml.prototype.watch = function () {
        var _this = this;
        var watchPath = path.join(this.tplPath, '**/*.html');
        var watcher = chokidar.watch(watchPath, {
            persistent: true
        });
        watcher.on('all', function (event, path) {
            if (_this.stats === null)
                return;
            _this.build();
            // 通过 sockets 发送刷新信号
            if (_this.compiler && _this.compiler._server &&
                _this.compiler._server.socketSendData) {
                _this.compiler._server.socketSendData(_this.compiler._server.sockets, _this.stats.toJson(), null, 'changeTpl', [path]);
            }
        });
    };
    BuildHtml.prototype.build = function () {
        var _this = this;
        if (this.stats === null)
            return;
        var packMap = this.stats.toJson().assetsByChunkName;
        var packs = Object.keys(packMap);
        var renderData = {
            module: {},
            staticPath: '',
            env: 'sit'
        };
        Object.keys(this.varMap).forEach(function (key) {
            if (typeof _this.varMap[key] === 'function') {
                renderData[key] = _this.varMap[key]();
            }
        });
        // 注册 module:name
        packs.forEach(function (pack) {
            if (Array.isArray(packMap[pack])) {
                renderData.module[pack] = packMap[pack][0];
                packMap[pack].forEach(function (fileName) {
                    var name = "" + pack + path.extname(fileName);
                    renderData.module[name] = fileName;
                });
            }
            else {
                renderData.module[pack] = packMap[pack];
                renderData.module[(pack + ".js")] = packMap[pack];
                renderData.module[(pack + ".css")] = '';
            }
        });
        this.template.addFilter('url', function (moduleName, staticPath, env) {
            if (staticPath == undefined) {
                staticPath = renderData.staticPath;
            }
            if (env == undefined) {
                env = renderData.env;
            }
            return staticPath + "dist/" + env + "/" + renderData.module[moduleName];
        });
        this.buildCallback(renderData);
        getDep(this.tplPath, this.outPath).forEach(function (v) {
            var tpl = fs.readFileSync(v.soure, 'utf8');
            try {
                tpl = _this.template.renderString(tpl, renderData);
                fs.writeFileSync(v.out, tpl, 'utf8');
            }
            catch (err) {
                console.error(err);
            }
        });
    };
    return BuildHtml;
}());
exports.__esModule = true;
exports["default"] = BuildHtml;
