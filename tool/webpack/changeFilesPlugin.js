/**
 * get webpack change files
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var WatchFile = (function () {
    function WatchFile() {
        this.startTime = Date.now();
        this.prevTimestamps = {};
    }
    WatchFile.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('emit', function (compilation, callback) {
            var changedFiles = Object.keys(compilation.fileTimestamps).filter(function (watchfile) {
                return (_this.prevTimestamps[watchfile] || _this.startTime) < (compilation.fileTimestamps[watchfile] || Infinity);
            });
            if (compiler._server && compiler._server.socketSendData && compiler._server._stats) {
                compiler._server.socketSendData(compiler._server.sockets, compiler._server._stats.toJson(), null, 'changeFile', changedFiles);
            }
            _this.prevTimestamps = compilation.fileTimestamps;
            callback();
        });
    };
    return WatchFile;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WatchFile;
//# sourceMappingURL=changeFilesPlugin.js.map