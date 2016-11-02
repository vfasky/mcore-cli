/**
* confirm
* @date 2016-11-02 16:44:39
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/

'use strict'

let prompt = require('prompt')

module.exports = function (msg, callback) {
    prompt.start()

    prompt.get({
        properties: {
            confirm: {
                description: msg,
                message: 'Type yes/no',
                // allow yes, no, y, n, YES, NO, Y, N as answer
                pattern: /^(yes|no|y|n)$/gi,
                required: true,
                default: 'yes'
            }
        }
    }, (err, result) => {
        if (err) {
            console.log(err)
            return callback(false)
        }
        // transform to lower case
        let c = result.confirm.toLowerCase()
        // yes or y typed ? otherwise abort
        if (c !== 'y' && c !== 'yes') {
            callback(false)
            return
        }

        // your code
        callback(true)
    })
}
