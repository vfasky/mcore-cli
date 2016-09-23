###*
 *
 * mcore app bootstrap
###
'use strict'

{App} = require 'mcore3'
$ = require 'jquery'

app = new App $('#main')

$(document.body).removeClass 'loading'

app.route '/', require '../view/index'
   .run()
