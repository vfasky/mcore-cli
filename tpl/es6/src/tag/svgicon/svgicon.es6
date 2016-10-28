/**
* svg icon
* @date 2016-10-27 10:42:44
* @author Allenice <994298628@qq.com>
* @link http://www.allenice233.com
*/

/**
 *
 */

import {Template, Component} from 'mcore3'
import $ from 'jquery'

export default class Svgicon extends Component {
    init () {
        this.$parentNode = $(this.el)
        this.buildSVG()
    }

    watch () {
        this.on('change:icon', ()=>{
            this.buildSVG()
        })

        this.on('change:dir', ()=>{
            this.buildSVG()
        })

        this.on('change:fill', ()=>{
            this.buildSVG()
        })

        this.on('change:width', ()=>{
            this.buildSVG()
        })

        this.on('change:height', ()=>{
            this.buildSVG()
        })

    }


    buildSVG () {
        let width = this.scope.width || ''
        let height = this.scope.height || ''
        let className = 'svg-icon'

        if (this.scope.dir) {
            className += ' svg-' + this.scope.dir
        }

        if (this.scope.fill !== undefined) {
            className += ' svg-fill'
        }

        this.$parentNode.html(`
            <svg class="${className}" style="width: ${width}; height: ${height};">
                <use xlink:href="#svg-${this.scope.icon}" ></use>
            </svg>
        `)
    }
}

Template.components['svgicon'] = Svgicon
