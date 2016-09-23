socket = require 'webpack-dev-server/client/socket'
$ = require 'jquery'
path = require 'path'

_hash = null
socket '/sockjs-node',
    close: ->
        console.error '[MC] sockjs close'

    hash: (hash)->
        if !_hash
            console.log '[MC] hot replace ok'
            _hash = hash
            return
        _hash = hash
        $.getJSON '/_changedFiles.json'
         .then (changedFiles)=>
             isScript = false
             scriptTypes = ['.coffee', '.js', '.tpl', '.html', '.es6']
             for file in changedFiles
                 extname = path.extname file
                 if extname in scriptTypes
                     console.log extname
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
