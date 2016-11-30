/**
 *
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict'

const glob = require('glob')
const Typedoc = require('Typedoc')
const path = require('path')
const fs = require('fs-extra')

const typedocDefaultOptions = {
    typedoc: {
        logger: 'console',
        mode: 'Modules',
        module: 'commonjs',
        moduleResolution: 'node',
        excludeExternals: false
    },
    jsonName: 'typedoc.json'
}

module.exports = function (sourPaths, options = { rootPath: './' }, mcorerc = {}) {
    options = Object.assign({}, typedocDefaultOptions, options)
    // console.log(sourPaths, options)

    let app = new Typedoc.Application(options.typedoc)

    let moduleMap = {}

    sourPaths.forEach((v) => {
        glob.sync(path.join(v, '**/*.ts')).forEach((filePath) => {
            let pathInfo = path.parse(filePath)
            let relativePath = path.relative(options.rootPath, filePath)
            let moduleName = path.parse(relativePath).dir

            if (moduleMap.hasOwnProperty(moduleName) === false) {
                moduleMap[moduleName] = {
                    fileSoures: [],
                    index: null,
                    doc: null
                }
            }

            if (pathInfo.base === 'index.ts') {
                moduleMap[moduleName].index = filePath
            }

            if (['index.ts', 'test.ts'].indexOf(pathInfo.base) === -1) {
                moduleMap[moduleName].fileSoures.push(filePath)
            }
        })
    })

    Object.keys(moduleMap).forEach((module) => {
        let info = moduleMap[module]
        let isIndex = false
        if (info.fileSoures.length === 0 && info.index) {
            isIndex = true
            info.fileSoures.push(info.index)
        }

        if (info.fileSoures.length) {
            let project = app.convert(info.fileSoures)
            if (project) {
                info.doc = project.toObject()
                if (isIndex) {
                    let dirname = path.dirname(info.index)
                    let name = dirname.split(path.sep).pop()
                    info.doc.children.forEach((children) => {
                        if (children.name === '"index"') {
                            children.name = name
                        } else {
                            children.name = children.name.replace(/"/, '')
                        }
                    })
                } else {
                    info.doc.children.forEach((children) => {
                        children.name = children.name.replace(/"/, '')
                    })
                }
            }
        }
    })

    if (options.outPath) {
        if (mcorerc.docapi && mcorerc.docapi.appKey && mcorerc.docapi.appId && mcorerc.docapi.title) {
            const needle = require('needle')
            const crypto = require('crypto')
            const apiOptions = Object.assign({
                url: 'https://api.catke.com'
            }, mcorerc.docapi)
            const now = Date.now()

            const sign = crypto.createHash('sha1').update(
                `${apiOptions.appKey},${now}`
            ).digest('hex') + ',' + now

            let data = {
                json: JSON.stringify(moduleMap),
                _appId: apiOptions.appId,
                _appSign: sign
            }
            console.log('upload doc ...')
            needle.post(`${apiOptions.url}/doc/${apiOptions.title.trim()}`, data, (err, resp) => {
                if (err) return console.log(err)
                console.log(resp.body)
                console.log(`See Doc https://doc.catke.com/#/read/${apiOptions.title.trim()}`)
            })
        } else {
            fs.mkdirsSync(options.outPath)
            let outFile = path.join(options.outPath, options.jsonName)
            fs.writeJsonSync(outFile, moduleMap)
            console.log('write %s success', outFile)
        }
    } else {
        console.dir(moduleMap, { depth: null })
    }
}
