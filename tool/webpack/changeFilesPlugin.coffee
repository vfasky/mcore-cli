###*
 *
 * 取 webpack 更新文件列表
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

fs = require 'fs'

WatchFile = ->
    # @changedFilesFile = changedFilesFile
    @startTime = Date.now()
    @prevTimestamps = {}
    return

WatchFile.prototype.apply = (compiler)->
    compiler.plugin 'emit', (compilation, callback)=>

        changedFiles = Object.keys(compilation.fileTimestamps).filter (watchfile)=>
            (@prevTimestamps[watchfile] or @startTime) < (compilation.fileTimestamps[watchfile] or Infinity)

        # fs.writeFile @changedFilesFile, JSON.stringify(changedFiles), 'utf8', =>
        #     callback()

        if compiler._server and compiler._server.socketSendData and compiler._server._stats
            compiler._server.socketSendData(
                compiler._server.sockets,
                compiler._server._stats.toJson(),
                null,
                'changeFile',
                changedFiles
            )

        @prevTimestamps = compilation.fileTimestamps
        callback()


module.exports = WatchFile
