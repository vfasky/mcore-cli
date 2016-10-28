
import Base from '../base'

export default class Greet extends Base {
    init () {
        this.render(require('./greet.tpl'))
    }
}
