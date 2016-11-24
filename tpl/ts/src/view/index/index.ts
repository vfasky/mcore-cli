/**
* 首页
*/

import View from 'view/base'
import './index.scss'

import Greet from 'ui/greet'

export default class Index extends View {

    static get viewName() {
        return 'index'
    }

    run () {
        let greet = new Greet(this.el)
        this.render(require('./index.tpl'))
    }
}
