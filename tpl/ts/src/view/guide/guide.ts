/**
* 首页
*/

import View from 'view/base'

export default class Guide extends View {

    static get viewName() {
        return 'guide'
    }

    run () {
        this.render(require('./guide.tpl'))
    }
}
