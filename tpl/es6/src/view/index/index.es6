/**
* 首页
* @date 2016-10-25 17:39:40
* @author
* @link
*/

import View from '../base'
import Greet from 'ui/greet/greet'

import './index.scss'

export default class Index extends View {

    static get viewName () {
        return 'index'
    }

    run () {
        let greet = new Greet(this.el)
        console.log(greet)
        this.render(require('./index.tpl'))
    }

}
