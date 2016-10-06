/**
* 路由
* @date 2016-10-06 16:13:10
* @author
* @link
*/

export default function (app, done = () => {}) {
    function route (rule, view) {
        app.route(rule, view.default)
        return route
    }

    route('/', require('../view/index'))

    done()
}
