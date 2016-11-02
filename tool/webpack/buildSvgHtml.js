/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../definition/fs-plus.d.ts" />
"use strict";
/**
* 生成 svg 的 html 文件
* @date 2016-09-07 16:45:03
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/
var path = require('path');
var fs = require('fs');
function default_1(htmlPath, iconPath) {
    fs.readdir(iconPath, function (err, files) {
        if (err) {
            console.log(err);
        }
        var listHtml = '<ul>';
        files.forEach(function (filename) {
            if (path.extname(filename) === '.svg') {
                var name_1 = path.basename(filename, '.svg');
                listHtml += "\n                    <li>\n                        <div class=\"style-name\">" + name_1 + "</div>\n                        <div class=\"style-normal\">\n                            <svg class=\"svg-icon\">\n                                <use xlink:href=\"#svg-" + name_1 + "\"></use>\n                            </svg>\n                        </div>\n                        <div class=\"style-fill\">\n                            <svg class=\"svg-icon svg-fill\">\n                                <use xlink:href=\"#svg-" + name_1 + "\"></use>\n                            </svg>\n                        </div>\n                    </li>\n                ";
            }
        });
        listHtml += '</ul>';
        var html = "\n            <!DOCTYPE html>\n            <html lang=\"en\">\n            <head>\n                <meta charset=\"UTF-8\" />\n                <title>Svgicon</title></head>\n                <style>\n                    .svg-icon {\n                        display: inline-block;\n                        vertical-align: middle;\n                        width: 16px;\n                        height: 16px;\n                        fill: none;\n                        color: inherit;\n                        stroke: currentColor;\n                    }\n\n                    .svg-fill {\n                        fill: currentColor;\n                        stroke: none;\n                    }\n\n                    .svg-up {\n                        transform: rotate(-90deg);\n                    }\n\n                    .svg-right {\n\n                    }\n\n                    .svg-down {\n                        transform: rotate(90deg);\n                    }\n\n                    .svg-left {\n                        transform: rotate(180deg);\n                    }\n\n                    ul {\n                        list-style: none;\n                        overflow: hidden;\n                    }\n\n                    li {\n                        display: inline-block;\n                        text-align: center;\n                        margin-bottom: 10px;\n                        color: #fff;\n                        margin-right: 15px;\n                    }\n\n                    li > div {\n                        display: inline-block;\n                        padding: 10px;\n                        border-radius: 50%;\n                        color: #2AAEFF;\n                    }\n\n                    .style-name {\n                        display: block;\n                        background: transparent;\n                        color: #4a4a4a;\n                        font-size: 24px;\n                    }\n\n                    .svg-icon {\n                        width: 100px;\n                        height: 100px;\n                    }\n                </style>\n                <script>\n                    window.baseUrl = './'\n                </script>\n            <body>\n                " + listHtml + "\n                <script src=\"./svg.js\"></script>\n            </body>\n            </html>\n        ";
        fs.writeFileSync(htmlPath, html, 'utf8');
    });
}
exports.__esModule = true;
exports["default"] = default_1;
