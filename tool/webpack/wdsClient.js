/// <reference path="../../definition/webpack-dev-server-client-socket.d.ts" />
/**
 * WDS client
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var socket = require('webpack-dev-server/client/socket');
var $ = require('jquery');
var path = require('path');
var _hash = null;
socket('/sockjs-node', {
    changeFile: function (changeFiles) {
        var isScript = false;
        var scriptTypes = ['.coffee', '.js', '.tpl', '.es6', '.html'];
        for (var _i = 0, changeFiles_1 = changeFiles; _i < changeFiles_1.length; _i++) {
            var file = changeFiles_1[_i];
            var extname = path.extname(file);
            if (scriptTypes.indexOf(extname.toLowerCase()) !== -1) {
                isScript = true;
                break;
            }
        }
        if (isScript) {
            console.log('[MC] change script, reload()');
            window.location.reload();
            return;
        }
        console.log('[MC] chagne style');
        var cssList = $('link[rel=stylesheet]');
        cssList.each(function () {
            var link = this.href;
            if (link.indexOf('_v=') !== -1) {
                link = link.split('_v=').shift() + '_v=' + (new Date()).getTime();
            }
            else {
                var s = link.indexOf('?') !== -1 ? '&' : '?';
                link += s + "_v=" + (new Date()).getTime();
            }
            this.href = link;
        });
    },
    changeTpl: function () {
        window.location.reload();
    },
    hash: function (hash) {
        if (_hash === null) {
            console.log('[MC] hot replace ok');
            _hash = hash;
            return;
        }
    }
});
//# sourceMappingURL=wdsClient.js.map