<div class="view-guide">
    <aside>
        <div class="logo">
            <svgicon icon="mcore" fill width="100" height="100"></svgicon>
        </div>
        <ul>
            <li class="cur">命令</li>
            <li>组件</li>
            <li>样式</li>
            <li>svg 图标</li>
        </ul>
    </aside>
    <article>
        <h1>命令</h1>
        <div class="tc">
            <ul class="cmd">
                <li><span>开发模式： </span><span>npm run dev</span></li>
                <li><span>sit 环境： </span><span>npm run sit</span></li>
                <li><span>uat 坏境： </span><span>npm run uat</span></li>
                <li><span>线上坏境： </span><span>npm run deply</span></li>
                <li><span>创建 svg 图标： </span><span>npm run svg</span></li>
                <li><span>格式化 es6 代码</span><span>npm run fix</span></li>
            </ul>
        </div>
        <p>提交代码的时候，请务必执行 npm run fix</p>
        <h1>组件</h1>
        <p>
            每个 tag, ui, view 都由四个文件组成:  主逻辑的 es6 文件、样式文件，模板文件，再加上一个入口文件。比如一个 hello 的 tag 为例：
        </p>
        <ul class="dir">
            <li>
                hello
                <ul>
                    <li>hello.es6</li>
                    <li>hello.scss</li>
                    <li>hello.tpl</li>
                    <li>index.es6</li>
                </ul>
            </li>
        </ul>
        <p>
            index.es6 文件的作用是为了方便其他组件引用，一般 index.es 的代码如下：
        </p>
        <div class="code">
            <div>import './hello.scss'</div>
            <div>import Hello from './hello'</div>
            <div>export default Hello</div>
        </div>
        <p>为什么没有将文件名都改成 index.xxx, 主要是因为考虑到文件名相同的话，当组件一多，太多相同的文件名会容易混淆，容易改错地方，又不便查找。</p>
        <p>引入组件的时候，不需要用相对路径的方式引入了，直接按照 src 目录作为根目录引入即可。组件的文件层次变深了，使用相对路径比较麻烦。比如一个 ui 要引用一个 tag, 可以这样引入 tag:
        </p>
        <div class="code">
            <div>import 'tag/hello'</div>
        </div>
        <h1>样式</h1>
        <p>样式我们默认使用了一个框架：<a href="https://github.com/thoughtbot/bourbon" target="_blank">Bourbon</a>, 虽然这个框架提供了一些处理浏览器兼容的 mixins （比如 animate） ，但是我们不需要使用这些，因为项目已经使用了 autoprefix 去处理这些了。</p>
        <p>样式使用背景图片的话，请使用 resovle 方法，如果需要兼容 retina 屏，请切多一张同名的以后缀名为 @2x.png 的图片</p>
        <div class="code">
            <div>// 图片需要放到 images 文件夹，路径都以这个文件夹开始</div>
            <div>background: resolve('logo.png') no-repeat at-2x;</div>
        </div>
        <p>import 其他 scss 文件的时候，也不需要使用相对路径了，默认是以 ./src/sass 这个文件夹开始</p>
        <div class="code">
            <div>@import 'base/base';</div>
        </div>
        <p class="color-red">_base.scss 文件千万不要引入任何会生成样式的 scss 文件，因为组件里面的样式文件都会引用 _base.scss 文件的，如果这个文件生成样式的话，会导致生成很多重复的样式。</p>
        <p>组件的样式都需要一个 class 作为命名空间，这个 class 的命名需要以这个组件的类型作为前缀，比如一个叫 hello 的 tag, 它的命名空间是 .tag-hello {} ， 比如一个叫 greet 的 ui, 它的命名空间是 .ui-greet。 类推 view。</p>
        <p>如果两个或多个组件的样式非常相似，那么可以建一个父组件，然后组件基础这个父组件。</p>
        <h1>svg 图标</h1>
        <p>生成 svg 图片之前，请先看 <a href="/svg/dist/icons.html">svg icon</a> 里面有没有，如果没有的话，再添加，添加方式是将 svg 文件放到 /svg/src 文件夹里面，然后运行 npm run svg</p>
        <p>模板里面使用方式：</p>
        <div class="code">
            <div class="core">
                <pre>&lt;svgicon icon="mcore" fill dir="left" width="24" height="24"&gt;&lt;/svgicon&gt;</pre>
            </div>
        </div>
    </article>
</div>
