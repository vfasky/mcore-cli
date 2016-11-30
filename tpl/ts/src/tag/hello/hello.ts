import * as mcore from 'mcore3'
import Base from 'tag/base'

export default class Hello extends Base {
    init () {
        this.render(require('./hello.tpl'))
    }
}

mcore.Template.components['hello'] = Hello
