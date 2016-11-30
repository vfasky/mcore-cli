
import * as mcore from 'mcore3'

mcore.Template.formatters['bg'] = function (imgUrl) {
    if (!imgUrl) {
        return ''
    }

    return `background-image: url(${imgUrl});`
}
