
import Base from '../base';
import './greet.scss';

export default class Greet extends Base {
    init() {
        this.render(require('./greet.tpl'))
    }
}
