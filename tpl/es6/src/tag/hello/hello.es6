
import {Template} from 'mcore3';
import Base from '../base';
import './hello.scss';

export default class Hello extends Base {
    init() {
        this.render(require('./hello.tpl'))
    }
}

Template.components['hello'] = Hello;
