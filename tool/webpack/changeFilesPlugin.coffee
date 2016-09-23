###*
 *
 * 取 webpack 更新文件列表
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

fs = require 'fs'

WatchFile = (changedFilesFile)->
    @changedFilesFile = changedFilesFile
    @startTime = Date.now()
    @prevTimestamps = {}
    return

WatchFile.prototype.apply = (compiler)->
    compiler.plugin 'emit', (compilation, callback)=>
        
        changedFiles = Object.keys(compilation.fileTimestamps).filter (watchfile)=>
            (@prevTimestamps[watchfile] or @startTime) < (compilation.fileTimestamps[watchfile] or Infinity)

        fs.writeFile @changedFilesFile, JSON.stringify(changedFiles), 'utf8', =>
            callback()

        @prevTimestamps = compilation.fileTimestamps



module.exports = WatchFile
