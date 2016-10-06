socket = require 'webpack-dev-server/client/socket'
$ = require 'jquery'
path = require 'path'

_hash = null
socket '/sockjs-node',
    changeFile: (changedFiles)->
        isScript = false
        scriptTypes = ['.coffee', '.js', '.tpl', '.es6', '.html']
        for file in changedFiles
            extname = path.extname file
            if extname in scriptTypes
                isScript = true
                break

        if isScript
            console.log '[MC] change script, reload()'
            window.location.reload()
            return

        console.log '[MC] chagne style'
        cssList = $ 'link[rel=stylesheet]'
        cssList.each ->
            link = @href
            if link.indexOf('_v=') != -1
                link = link.split('_v=').shift() + '_v=' + (new Date()).getTime()
            else
                s = link.indexOf('?') != -1 and '&' or '?'
                link = link + s + '_v=' + (new Date()).getTime()

            @href = link

    changeTpl: ->
        window.location.reload()

    hash: (hash)->
        # console.log hash
        if !_hash
            console.log '[MC] hot replace ok'
            _hash = hash
            return
