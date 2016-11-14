/**
 * sass 规范
 * @date 2016-11-11 15:25:26
 * @author Allenice <994298628@qq.com>
 * @link http://www.allenice233.com
 */

// 这里 js 使用双引号是因为想可以自由转换成 json

module.exports = {
    "ignoreFiles": ["node_modules/**/*.scss"],
    "extends": "stylelint-config-standard",
    "rules": {
        "color-hex-case": null,
        "color-hex-length": null,
        "max-empty-lines": 1,
        "indentation": 4,
        // 字符串使用双引号
        "string-quotes": "double",
        // 使用了 autoprefix 不需要前缀
        "property-no-vendor-prefix": true,
        "selector-type-no-unknown": null,
        "selector-pseudo-element-colon-notation": null,
        "number-leading-zero": null,
        // 属性顺序
        "declaration-block-properties-order": [{
            "type": "box",
            "order": "flexible",
            "properties": [
                "display",
                "float",
                "width",
                "height",
                "max-width",
                "max-height",
                "min-width",
                "min-height",
                "position",
                "left",
                "top",
                "right",
                "bottom",
                "padding",
                "margin",
                "padding-left",
                "padding-top",
                "padding-right",
                "padding-bottom",
                "margin-left",
                "margin-top",
                "margin-right",
                "margin-bottom"
            ]
        }, {
            "type": "border",
            "order": "flexible",
            "properties": [
                "border",
                "border-left",
                "border-right",
                "border-top",
                "border-bottom",
                "border-width",
                "border-style",
                "border-color",
                "border-radius",
                "border-image"
            ]
        }, {
            "type": "background",
            "order": "flexible",
            "properties": [
                "background",
                "background-image",
                "background-color",
                "background-position",
                "background-repeat",
                "background-size"
            ]
        }, {
            "type": "text",
            "order": "flexible",
            "properties": [
                "color",
                "text-align",
                "text-decoration",
                "text-overflow",
                "text-indent",
                "text-shadow",
                "text-transform",
                "font-size",
                "font-style",
                "font",
                "font-family"
            ]
        }]
    }
}
