/**
* mcore app bootstrap
* @date 2016-10-06 15:45:08
* @author
* @link
*/

import { App } from 'mcore3'
import $ from 'jquery'
import route from './route'

import 'svg'

import './components'

let app = new App($('#main'))

route(app, () => {
    app.run()
})
