
import { Template } from 'mcore3'

Template.formatters['bg'] = function (imgUrl) {
    if (!imgUrl) {
        return ''
    }

    return `background-image: url(${imgUrl});`
}
