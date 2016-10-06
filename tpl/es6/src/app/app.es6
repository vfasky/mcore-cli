/**
* mcore app bootstrap
* @date 2016-10-06 15:45:08
* @author
* @link
*/

import "../sass/app.scss";

import {App} from 'mcore3';
import $ from 'jquery';
import route from './route';

import './components';

let app = new App($('#main'));

route(app, function() {
    app.run();
});
