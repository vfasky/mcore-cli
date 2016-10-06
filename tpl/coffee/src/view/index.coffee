###*
 * home index
 *
###
'use strict'

{View} = require 'mcore3'

class Index extends View

    run: ->
        @render require('../tpl/view/index.tpl')


module.exports = Index
module.exports.viewName = 'index'
