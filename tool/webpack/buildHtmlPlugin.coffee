###*
 *
 * build html plugin
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

fs = require 'fs-plus'
path = require 'path'
glob = require 'glob'
nunjucks = require 'nunjucks'

getDep = (tplPath, outPath)->
    # 读模板文件
    tplFiles = glob.sync path.join tplPath, '**/*.html'
    data = []

    for htmlFile in tplFiles
        relative = path.relative tplPath, htmlFile
        basename = path.basename htmlFile
        if basename.indexOf('_') != 0
            data.push
                soure: htmlFile
                relative: relative
                out: path.join outPath, relative

    data


module.exports = (options = {})->
    tplPath = options.tplPath or= ''
    outPath = options.outPath or = ''
    varMap = options.varMap or= {}
    filter = options.filter or= {}

    template = nunjucks.configure tplPath,
        autoescape: false

    ->
        @plugin 'done', (stats)->
            packMap = stats.toJson().assetsByChunkName
            packs = Object.keys packMap

            renderData =
                module: {}

            for key, val of varMap
                renderData[key] = val()

            # 注册 module:name
            packs.forEach (pack)->
                if Array.isArray(packMap[pack])
                    renderData.module[pack] = packMap[pack][0]
                    # varMap['module:' + pack] = -> packMap[pack][0]

                    packMap[pack].forEach (filename)->
                        renderData.module["#{pack}#{path.extname filename}"] = filename

                else
                    renderData.module[pack] = packMap[pack]
                    renderData.module[pack + '.js'] = packMap[pack]
                    renderData.module[pack + '.css'] = ''


            template.addFilter 'url', (moduelName, staticPath = renderData.staticPath, env = renderData.env)->
                "#{staticPath}dist/#{env}/#{renderData.module[moduelName]}"

            for name, callback of filter
                template.addFilter name, callback, callback.isSync

            for v in getDep(tplPath, outPath)
                # 替换模板
                tpl = fs.readFileSync v.soure, 'utf8'

                tpl = template.renderString tpl, renderData

                fs.writeFileSync v.out, tpl, 'utf8'
