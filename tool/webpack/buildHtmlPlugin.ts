/// <reference path="../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../definition/fs-plus/fs-plus.d.ts" />
/**
 * build html for webpack plugin
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import * as fs from 'fs-plus'
import * as path from 'path'
import * as glob from 'glob'
import * as nunjucks from 'nunjucks'
import * as chokidar from 'chokidar'


interface pathInfo {
    soure: string; // html file path
    relative: string; // soure path
    out: string; // out path
}

/**
 * 取所有模板列表
 * @param tplPath 模板目录
 * @param outPath 输出目录
 */
function getDep (tplPath:string, outPath:string):pathInfo[] {
    
    // 读模板文件
    let tplFiles = glob.sync(path.join(tplPath, '**/*.html'))
    let data:pathInfo[] = []
    
    tplFiles.forEach((htmlFile) => {
        let relative = path.relative(tplPath, htmlFile)
        let baseName = path.basename(htmlFile)
        // 忽略以 _ 开头的文件名
        if (baseName.indexOf('_') !== 0) {
            data.push({
                soure: htmlFile,
                relative: relative,
                out: path.join(outPath, relative)
            })
        }
    })
    
    return data
}

interface buildHtmlOptions {
    tplPath: string;
    outPath: string;
    varMap?: any;
}

/**
 * BuildHtml
 */
export default class BuildHtml {
    tplPath: string;
    outPath: string;
    varMap: any;
    /**
     * webpack compiler status
     */
    stats: null|any;
    /**
     * webpack compiler
     */
    compiler: null|any;
    
    template: nunjucks.Environment
    
    constructor (options:buildHtmlOptions) {
        this.tplPath = options.tplPath
        this.outPath = options.outPath
        this.varMap = options.varMap || {}
        this.stats = null
        
        this.template = nunjucks.configure(this.tplPath, {
            autoescape: false,
            noCache: true
        })
        
        this.watch()
    }
    
    apply (compiler:any):void {
        this.compiler = compiler
        compiler.plugin('done', (stats:any) => {
            this.stats = stats
            this.build()
        })
    }
    
    watch ():void {
        let watchPath = path.join(this.tplPath, '**/*.html')
        let watcher = chokidar.watch(watchPath, {
            persistent: true
        })
        watcher.on('all', (event:any, path:string) => {
            if(this.stats === null) return
            
            this.build()
            // 通过 sockets 发送刷新信号
            if (this.compiler && this.compiler._server &&
                this.compiler._server.socketSendData) {
                this.compiler._server.socketSendData(
                    this.compiler._server.sockets,
                    this.stats.toJson(),
                    null,
                    'changeTpl',
                    [path]
                )
            }
        })
    }
    
    build ():void {
        if (this.stats === null) return
        
        let packMap:any = this.stats.toJson().assetsByChunkName
        let packs = Object.keys(packMap)
        
        interface renderDataConfig {
            module: any;
            staticPath: string;
            env: string;
            [key:string]: any;
        }

        let renderData:renderDataConfig = {
            module: {},
            staticPath: '',
            env: 'sit'
        }
        
        Object.keys(this.varMap).forEach((key) => {
            if (typeof this.varMap[key] === 'function'){
                renderData[key] = this.varMap[key]()
            }
        })
        
        // 注册 module:name
        packs.forEach((pack) => {
            if (Array.isArray(packMap[pack])) {
                renderData.module[pack] = packMap[pack][0]
                
                packMap[pack].forEach((fileName:string) => {
                    let name = `${pack}${path.extname(fileName)}`
                    renderData.module[name] = fileName
                    
                })
            } else {
                renderData.module[pack] = packMap[pack]
                renderData.module[`${pack}.js`] = packMap[pack]
                renderData.module[`${pack}.css`] = ''
            }
        })
        
        this.template.addFilter('url', (moduleName:string, staticPath?:string, env?:string) => {
            if (staticPath == undefined) {
                staticPath = renderData.staticPath
            }
            if (env == undefined) {
                env = renderData.env
            }
            return `${staticPath}dist/${env}/${renderData.module[moduleName]}`
        })
        
        getDep(this.tplPath, this.outPath).forEach((v) => {
            let tpl = fs.readFileSync(v.soure, 'utf8')
            try {
                tpl = this.template.renderString(tpl, renderData)
                fs.writeFileSync(v.out, tpl, 'utf8')
            } catch (err) {
                console.error(err)
            }
        })
    }
}