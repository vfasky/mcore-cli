import Base from 'ui/base'

export default class Greet extends Base {
    init () {
        this.render(require('./greet.tpl'))
    }
}
