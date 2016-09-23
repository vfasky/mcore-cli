###*
 *
 * build html plugin
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

fs = require 'fs-plus'
path = require 'path'
glob = require 'glob'

getDep = (tplPath, outPath)->
    # 读模板文件
    tplFiles = glob.sync path.join tplPath, '**/*.html'
    data = []

    for htmlFile in tplFiles
        relative = path.relative tplPath, htmlFile
        data.push
            soure: htmlFile
            relative: relative
            out: path.join outPath, relative

    data


module.exports = (options = {})->
    tplPath = options.tplPath or= ''
    outPath = options.outPath or = ''
    varMap = options.varMap or= {}

    ->
        @plugin 'done', (stats)->
            packMap = stats.toJson().assetsByChunkName
            packs = Object.keys packMap

            # 注册 module:name
            packs.forEach (pack)->
                if Array.isArray(packMap[pack])
                    varMap['module:' + pack] = -> packMap[pack][0]

                    packMap[pack].forEach (filename)->
                        varMap["module:#{pack}#{path.extname filename}"] = -> filename
                else
                    varMap['module:' + pack] = -> packMap[pack]
                    varMap['module:' + pack + '.js'] = -> packMap[pack]
                    varMap['module:' + pack + '.css'] = -> ''

            for v in getDep(tplPath, outPath)
                # 替换模板
                tpl = fs.readFileSync v.soure, 'utf8'

                for reName, reValue of varMap
                    reg = new RegExp '#{' + reName + '}', 'g'
                    tpl = tpl.replace reg, reValue()

                fs.writeFileSync v.out, tpl, 'utf8'
