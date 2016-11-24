/**
 * WDS client
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import * as socket from 'webpack-dev-server/client/socket'
import * as $ from 'jquery'
import * as path from 'path'

let _hash: any = null

socket('/sockjs-node', {
    changeFile: function(changeFiles: any[]) {
        let isScript = false
        let scriptTypes = ['.coffee', '.js', '.tpl', '.es6', '.html']
        for(let file of changeFiles) {
            let extname = path.extname(file)
            if (scriptTypes.indexOf(extname.toLowerCase()) !== -1) {
                isScript = true
                break
            }
        }

        if (isScript) {
            console.log('[MC] change script, reload()')
            window.location.reload()
            return
        }

        console.log('[MC] chagne style')
        let cssList = $('link[rel=stylesheet]')
        cssList.each(function() {
            let link = this.href
            if (link.indexOf('_v=') !== -1) {
                link = link.split('_v=').shift() + '_v=' + (new Date()).getTime()
            } else {
                let s = link.indexOf('?') !== -1 ? '&' : '?'
                link += `${s}_v=${(new Date()).getTime()}`
            }
            this.href = link
        })
    },

    changeTpl: function(){
        window.location.reload()
    },

    hash: function(hash: string) {
        if (_hash === null) {
            console.log('[MC] hot replace ok')
            _hash = hash
            return
        }
    }
})