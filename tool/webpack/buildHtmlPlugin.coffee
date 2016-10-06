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
gaze = require 'gaze'

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

BuildHtml = (options = {})->
    @tplPath = options.tplPath or= ''
    @outPath = options.outPath or= ''
    @varMap = options.varMap or= {}
    @stats = null

    tplFiles = path.join @tplPath, '**/*.html'

    watch = new gaze.Gaze tplFiles
    watch.on 'all', (event, filepath)=>
        # console.log event, filepath
        return if !@stats
        @build @stats
        if @compiler._server and @compiler._server.socketSendData
            # console.log @compiler._server.sockets, @stats.hash
            # @compiler._server._sendStats @compiler._server.sockets, @stats.toJson()
            @compiler._server.socketSendData(
                @compiler._server.sockets,
                @stats.toJson(),
                null,
                'changeTpl',
                [tplFiles]
            )

    @template = nunjucks.configure @tplPath,
        autoescape: false
        noCache: true

    return

BuildHtml::build = (stats)->
    packMap = stats.toJson().assetsByChunkName
    packs = Object.keys packMap

    renderData =
        module: {}

    for key, val of @varMap
        renderData[key] = val()

    # 注册 module:name
    packs.forEach (pack)->
        if Array.isArray(packMap[pack])
            renderData.module[pack] = packMap[pack][0]

            packMap[pack].forEach (filename)->
                renderData.module["#{pack}#{path.extname filename}"] = filename

        else
            renderData.module[pack] = packMap[pack]
            renderData.module[pack + '.js'] = packMap[pack]
            renderData.module[pack + '.css'] = ''


    @template.addFilter 'url', (moduelName, staticPath = renderData.staticPath, env = renderData.env)->
        "#{staticPath}dist/#{env}/#{renderData.module[moduelName]}"

    for v in getDep(@tplPath, @outPath)
        # 替换模板
        tpl = fs.readFileSync v.soure, 'utf8'

        try
            tpl = @template.renderString tpl, renderData
            fs.writeFileSync v.out, tpl, 'utf8'

        catch error
            console.error error



BuildHtml::apply = (compiler)->
    @compiler = compiler
    compiler.plugin 'done', (stats)=>
        @stats = stats
        @build stats


module.exports = BuildHtml