/**
* 首页
*/

import View from '../base'
import './index.scss'

export default class Index extends View {

    run () {
        this.render(require('./index.tpl'))
    }

}

Index.viewName = 'index'
