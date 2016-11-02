/**
* generate component file
* @date 2016-11-02 11:47:35
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/

'use strict'

let fs = require('fs-plus')
let path = require('path')
let colors = require('colors')
let confirm = require('../confirm')

function compile (tplFile, data) {
    let conent = fs.readFileSync(tplFile, 'utf8')

    return conent.replace(/\${(\w+)}/gi, function (match, name) {
        return data[name] ? data[name] : ''
    })
}

function fillZero (num) {
    if (num < 10) {
        return '0' + num
    }

    return num
}

function dateFormat (date) {
    let year = date.getFullYear()
    let month = fillZero(date.getMonth() + 1)
    let day = fillZero(date.getDate())
    let hour = fillZero(date.getHours())
    let min = fillZero(date.getMinutes())
    let sec = fillZero(date.getSeconds())

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}

function writeFiles (componentType, lang, distPath, data) {
    let tplPath = path.join(__dirname, './' + lang + '/' + componentType)

    fs.readdir(tplPath, 'utf8', (err, files) => {
        if (err) {
            console.log(colors.red(err))
            return false
        }

        files.forEach((filename) => {
            let content = compile(path.join(tplPath, filename), data)
            let distFileName = data.componentName + '.' + filename.split('.')[1]

            if (filename.indexOf('index') >= 0) {
                distFileName = 'index.' + lang
            }

            let filePath = path.join(distPath, distFileName)

            console.log(colors.green('write file: '))
            console.log(colors.underline(filePath))
            fs.writeFileSync(filePath, content, 'utf8')
        })

        console.log(colors.green(`${componentType}: ${data.componentName} is generated.`))
    })
}

module.exports = function (componentType, lang, distPath, data) {
    data.curDate = dateFormat(new Date())

    let _checkFile = path.join(distPath, data.componentName + '.es6')

    if (fs.existsSync(_checkFile)) {
        confirm(`The ${componentType} ${data.componentName} is exist. Do your want to override it?`, (flag) => {
            if (flag) {
                writeFiles(componentType, lang, distPath, data)
            }
        })
    } else {
        writeFiles(componentType, lang, distPath, data)
    }
}

