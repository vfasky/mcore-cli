# ${name}

> ${desc}

## Build Setup

``` bash
# 安装依赖
npm install

# 开发模式 localhost:${port}
npm run dev

# build for sit with minification
npm run sit

# build for uat with minification
npm run uat

# build for product with minification
npm run deploy

# build svg icon
npm run svg

```

详情请访问 [mcore-cli](https://github.com/vfasky/mcore-cli).
## 组件
每个 tag, ui, view 都由四个文件组成: 主逻辑的 es6 文件、样式文件，模板文件，再加上一个入口文件。比如一个 hello 的 tag 为例：

*  hello
    - hello.es6
    - hello.scss
    - hello.tpl
    - index.es6

index.es6 文件的作用是为了方便其他组件引用，一般 index.es 的代码如下：
``` javascript
import './hello.scss'
import Hello from './hello'
export default Hello
```

为什么没有将文件名都改成 index.xxx, 主要是因为考虑到文件名相同的话，当组件一多，太多相同的文件名会容易混淆，容易改错地方，又不便查找。

引入组件的时候，不需要用相对路径的方式引入了，直接按照 src 目录作为根目录引入即可。组件的文件层次变深了，使用相对路径比较麻烦。比如一个 ui 要引用一个 tag, 可以这样引入 tag:

``` javascript
import 'tag/hello'
```

## 样式
样式我们默认使用了一个框架：[Bourbon](https://github.com/thoughtbot/bourbon), 虽然这个框架提供了一些处理浏览器兼容的 mixins （比如 animate） ，但是我们不需要使用这些，因为项目已经使用了 autoprefix 去处理这些了。

样式使用背景图片的话，请使用 resovle 方法，如果需要兼容 retina 屏，请切多一张同名的以后缀名为 @2x.png 的图片

```
// 图片需要放到 images 文件夹，路径都以这个文件夹开始
background: resolve('logo.png') no-repeat at-2x;
```

import 其他 scss 文件的时候，也不需要使用相对路径了，默认是以 ./src/sass 这个文件夹开始

```
@import 'base/base';
```

> <span style="color: red;">_base.scss 文件千万不要引入任何会生成样式的 scss 文件，因为组件里面的样式文件都会引用 _base.scss 文件的，如果这个文件生成样式的话，会导致生成很多重复的样式。</span>

组件的样式都需要一个 class 作为命名空间，这个 class 的命名需要以这个组件的类型作为前缀，比如一个叫 hello 的 tag, 它的命名空间是 .tag-hello {} ， 比如一个叫 greet 的 ui, 它的命名空间是 .ui-greet。 类推 view。

如果两个或多个组件的样式非常相似，那么可以建一个父组件，然后组件基础这个父组件。

# svg 图标

生成 svg 图片之前，请先看 [svg icon](http://localhost:${port}/svg/dist/icons.html) 里面有没有，如果没有的话，再添加，添加方式是将 svg 文件放到 /svg/src 文件夹里面，然后运行 npm run svg

模板里面使用方式：

``` html
<svgicon icon="mcore" fill dir="left" width="24" height="24"></svgicon>
```