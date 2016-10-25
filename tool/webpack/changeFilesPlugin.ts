/**
 * get webpack change files
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

export default class WatchFile {

    startTime:number = Date.now()

    prevTimestamps:any = {}

    apply (compiler: any) {
        compiler.plugin('emit', (compilation: any, callback: any) => {
            let changedFiles = Object.keys(compilation.fileTimestamps).filter((watchfile)=> {
                return (this.prevTimestamps[watchfile] || this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity)
            })

            if (compiler._server && compiler._server.socketSendData && compiler._server._stats) {
                compiler._server.socketSendData(
                    compiler._server.sockets,
                    compiler._server._stats.toJson(),
                    null,
                    'changeFile',
                    changedFiles
                )
            }

            this.prevTimestamps = compilation.fileTimestamps

            callback()
        })
    }
}