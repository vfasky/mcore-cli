/**
* mcore app bootstrap
* @date 2016-10-06 15:45:08
* @author
* @link
*/

import * as mcore from 'mcore3'
import * as $ from 'jquery'
import route from './route'

import 'svg'

import './components'

let app = new mcore.App($('#main'))

route(app, () => {
    app.run()
})
