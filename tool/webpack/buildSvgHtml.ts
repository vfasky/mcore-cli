/**
* 生成 svg 的 html 文件
* @date 2016-09-07 16:45:03
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/

import * as path from 'path'
import * as fs from 'fs'


export default function(htmlPath:string, iconPath:string) {

    fs.readdir(iconPath, function(err, files) {
        if (err) {
            console.log(err)
        }

        let listHtml:string = '<ul>'

        files.forEach(function (filename) {
            if (path.extname(filename) === '.svg') {
                let name:string = path.basename(filename, '.svg')

                listHtml += `
                    <li>
                        <div class="style-name">${name}</div>
                        <div class="style-normal">
                            <svg class="svg-icon">
                                <use xlink:href="#svg-${name}"></use>
                            </svg>
                        </div>
                        <div class="style-fill">
                            <svg class="svg-icon svg-fill">
                                <use xlink:href="#svg-${name}"></use>
                            </svg>
                        </div>
                    </li>
                `
            }
        })

        listHtml += '</ul>'

        let html:string = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>Svgicon</title></head>
                <style>
                    .svg-icon {
                        display: inline-block;
                        vertical-align: middle;
                        width: 16px;
                        height: 16px;
                        fill: none;
                        color: inherit;
                        stroke: currentColor;
                    }

                    .svg-fill {
                        fill: currentColor;
                        stroke: none;
                    }

                    .svg-up {
                        transform: rotate(-90deg);
                    }

                    .svg-right {

                    }

                    .svg-down {
                        transform: rotate(90deg);
                    }

                    .svg-left {
                        transform: rotate(180deg);
                    }

                    ul {
                        list-style: none;
                        overflow: hidden;
                    }

                    li {
                        display: inline-block;
                        text-align: center;
                        margin-bottom: 10px;
                        color: #fff;
                        margin-right: 15px;
                    }

                    li > div {
                        display: inline-block;
                        padding: 10px;
                        border-radius: 50%;
                        color: #2AAEFF;
                    }

                    .style-name {
                        display: block;
                        background: transparent;
                        color: #4a4a4a;
                        font-size: 24px;
                    }

                    .svg-icon {
                        width: 100px;
                        height: 100px;
                    }
                </style>
                <script>
                    window.baseUrl = './'
                </script>
            <body>
                ${listHtml}
                <script src="./svg.js"></script>
            </body>
            </html>
        `

        fs.writeFileSync(htmlPath, html, 'utf8')
    })

}