# 19-webpack

重新温习温习 webpack。<br>
每次 commit 配对对应 Demo，webpack4.X 常用配置以及性能优化。更新中 ing

## webpack 基础内容讲解

---

### 什么是 loader？

> webpack 默认知道如何打包 js 文件，对于一些 css，图片，字体等非 js 文件需要使用使用 loader 去处理让 webpack 识别通过 loader 处理。
> <br>

File-loader 举例 -> 当 webpack 碰到 test 匹配的.jpeg 结尾的文件就会交给 use 的 file-loader 处理。<br>

- 首先遇到 test-img.jpeg 会将它移动到 dist 目录下，同时会修改名称。(文件移动到打包目录下)
- 然后得到一个图片相对与 dist 目录的一个名称然后讲名称返回给 require 的变量 default 属性中。(同时获得移动文件的地址)

> 其实 loader 就是一个特定方案，让 webapck 对一些不支持的文件通过 loader 认识他们并且进行打包。<br>
> webpack 对于非 js 文件通过 loader 进行识别。<br>
> module 中的 rules 进行配置。

#### 使用 loader 打包静态资源(图片)

- 处理图片资源 File-loader 和 Url-loader。
- url-loader 和 file-loader 配置和相似，url-loader 会将配置小于 limit(单位为 btye 1024 -> 1Kb)会转化为 base64。

#### 使用 loader 处理样式文件

1. 使用 loader 处理样式文件(1)

- loader 的处理是从右往左（从上往下），当一个文件需要被多个 loader 处理的时候。
- 处理 Css 文件通常需要两个 loader，css-loader 和 style-loder。
- 先使用 css 文件处理，如果有多个 css 文件互相引入，css-loader 会先进行处理->分析出 css 文件之间的关系，最终将 css 文件合并成为一个 css 文件。
- css-loader 处理完毕后，style-loader 会将生成的一个 css 文件挂载在 html 页面的 head 标签的 style 样式上。
- 如果要使用 less，scss 等预处理器，那么在碰到 less 等后缀文件的时候，需要额外引入对应 loader 进行处对应文件。
- sass-loader(将 less 语法编译成 css 语法) -> css-loader(处理 css 文件关系生成 css 文件) -> style-loader(加入页面 head 标签)
- sass-loader(npm install sass-loader node-sass -D)
- 针对一些 Css 属性的前缀，C3 不同厂商的前缀自动添加，可以使用 postcss-loader 中的 aotoprefexer 插件自动添加。
- postcss-loader(处理前缀 autoprefixer 插件) > sass-loader > css-loader > style-loader
- postcss.config.js 进行配置文件设置。[postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

> Tips: <br>

> 打包默认认为在高级浏览器中使用这些特性，高级浏览器已经没必要加这些前缀了。所以就算配置了 autoprefixer 也不会添加，package 中 browserList 里面加上老版本浏览器的兼容才会进行添加。
> 关于 browserList，可以在 Can I usr 查。

2. 使用 lodaer 处理样式文件(2)

- Cssloader 常用配置项。
  1. import-loaders:(Number),当使用 css 文件的时候。如果存在样式文件内引入样式文件也就是在样式文件中 import 在引入其他样式。webpack 在打包的时候就不会去走到 css-loader 之前的 loader 处理了。这个时候 importLoaders 配置的 number，就会保证在样式文件在在引入其他的样式文件，那么也会完整执行样式文件的 loader 顺序。
  2. modules:true.开启 Css 模块化，使用过 react 的朋友应该有感受。如果在 webpack 中直接引入样式文件那么会是全局的引入样式文件。开启 cssloader 的 modules 配置的话那么就会使样式文件模块化。

```
{
                test: /\.scss$/,
                // 样式文件中引入其他样式文件需要提前两个loader进行处理
                use: ["style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            modules: true
                        }
                    },
                    "sass-loader", "postcss-loader"
                ]
}
// 通常写法 全局引入
import "src/index.scss"

// css module写法
import style from "src/index.scss"
// 使用css module
<div class=style.container></div>  // div上增加style样式文件中的container类
```

> 关于 CssModules 的配置，如果开启了 cssModuels 那么匹配到的文件都会是模块化的，无论何种方式引入都不会是全局生效。业界目前主流解决方案是自定义文件后缀或者增加文件名称。<br>
> 比如 React 中以 xxx.modules.css 结尾的文件认为是 modules 局部样式，普通 xxx.css 是全局样式。要达成这样的效果需要配置两个 loader 的 rules，比如

```
{
                test: /\.scss$/,
                // 样式文件中引入其他样式文件需要提前两个loader进行处理
                use: ["style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    "sass-loader", "postcss-loader"
                ]
},
{
                // muss结尾的文件开启 css modules
                test: /\.suss$/,
                // 样式文件中引入其他样式文件需要提前两个loader进行处理
                use: ["style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            modules: true
                        }
                    },
                    "sass-loader", "postcss-loader"
                ]
}
```

#### 使用 loader 处理字体文件

- file-loader 帮助 webapck 识别 ttf,eot,woff 等格式的字体文件处理。
- file-loader 配置和 url-loader 类似，其实 fileloader 也可以处理图片文件，只不过 url-loader 存在 limit 配置可以转成 base64.
- file-loader 其实可以处理的文件类型有很多做，简单来说他的作用就是将这些匹配文件打包后放在 output 中去。

### Plugin

> Plugin 本质上就是在 webpack 运行到某个时刻的时候，帮我们做一些事情，类似生命周期函数。

#### [HTML-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)

> HTML-webpack-plugin 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件插入到 html 文件中。

- 常用配置信息
  1. title:用于生成 Html 的标题。（配合 ejs 或各框架使用- <%= htmlWebpackPlugin.options.title %>）
  2. filename:生成的名称，默认 index.html。
  3. template:指定路径，用于生成 html 文件时的模板文件。
  4. inject :true | ‘head’ | ‘body’ | false 。把所有产出文件注入到给定的 template 或 templateContent。当传入 true 或者 ‘body’时所有 javascript 资源将被放置在 body 元素的底部，“head”则会放在 head 元素内。
  5. favicon : 给定的图标路径，可将其添加到输出 html 中。
     ...

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```

#### [Clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

> 并非官方推荐，
> 打包运行前进行之前打包文件的删除。默认可以不传递任何参数。

- 常用配置 1. dry:默认 false，删除 mock 文件。 2. verbose:打印信息。
  ...
  > 之前配置更新了。。用到的还是查文档吧。。更新太快了。

### Entry 和 Output 的基础配置

#### entry

> 顾名思义，打包入口文件。

```
// 入口文件路径
entry: "./src/index.js"
// 这样配置就相当于 默认生成文件是main.js
entry: {
    main:"./src/index.js"
}
// 多入口文件打包
entry: {
    main:"./src/index.js",
    sub:"./src/main.js"
}
```

#### output

> 打包出口文件

```
output: {
    // 打包生成的文件名称
    filename:"[name].[hash].js",
    // 生成的文件打包后放在的path路径
    path:path.resolve(__dirname,"dist"),
    // publicPath:将打包后的静态资源路径添加publicPath的路径
    // 重新打包后，文件的路径都会增加http://cdn.com.cn的前缀。（关于publicPath后边会相详细讲解）
    publicPath:"http://cdn.com.cn"
}
```

### SourceMap

> sourceMap 作用：它是一个映射关系，如果代码有报错，通过 sourceMap 可以将打包后代码出错的地方映射到源码中出错的地方。

> 经过映射的转化我们也就可以快速精准的定位问题。

#### devtool (sourceMap 配置属性)

###### [devtool 配置属性和对应构建速度](url)

> Tips:

- 配置 sourceMap 后打包后的代码会对应出现 map.js 文件，她其实就是存放映射关系的(非 inline)。

- inline:如果添加一个 inline，就会将打包生成的 js 文件和.map 合并。map 文件变成 base64 文件放在打包后 js 文件底部。

- cheap：（增加构建速度）

  1. 只提示多少行出错并不提示多少列出错
  2. 只负责业务代码的错误，第三方插件错误并不会提示（比如 loader 的错误并不会提示）

- module:cheap 中存在 module，就是表示 cheap 打包后的代码，提示错误不仅会管理业务代码还会管理第三方模块的错误。

- eval:通过 eval 方式进行代码打包，eval 执行形式进行打包映射对应错误。（并不会生成.map，构建速度最快的方式）。

###### sourceMap 配置建议。

- development 建议:建议使用 cheap-module-eval-source-map 这种方式 提示比较全同时打包速度比较快的。
- production 建议：绝大多数不需要 sourceMap 配置，如果出现问题可以配置 cheap-module-source-map 线上代码有问题也可以定位错误。

### DevServer

> 每次都需要打包后打开 html 进行查看，devserve 帮助我们在本地启动一个 node 环境解决这个问题。

1. webpack's Watch Mode

```
// package.json:
scripts: {
    "watch":"webpack --watch"
}
```

> --watch 这个参数，监控到 webpack 所需要打包的代码发生改变。会自动执行打包代码，但是他并不会帮助我们起一个服务器。就意味着打包生成的文件是在本地访问。没有办法去做一些 ajax 的请求调试，而且每次打包过后都需自己手动刷新浏览器。

2. webpack-dev-server（推荐）

> webapck 内部已经内置了 devServer 的配置，但是注意我们还是需要安装 webpack-dev-server 这个插件。

- index：默认识别 html 文件名为 index.html，如果生成 HTML 的文件名非 index，则需要在 index 配置中改成对应的才可以正确启动。

  > HTML template is required to serve the bundle, usually it is an index.html file. Make sure that script references are added into HTML, webpack-dev-server doesn't inject them automatically.

- contextBase:指定静态资源的根目录的，意思就是不受 webpack 控制的资源文件。读取的路径，比方在没有设置 htmlwebpackplugin 的时候，devserver 会根据 contentbase 的目录去查找到对应 html 文件从而打开。但是一旦使用了 htmlwebpackplugin，contentbase 就会没有效果。htmlwebapckplugin 生成的文件 devserver 会直接打开而忽略 contentbase 配置。
  > contentBase，首先 devserver 需要依赖一个 html 文件去进行打开我们的网页然后实现启动服务监听，所以 contentBase 指向的路径就是 devServer 所依赖的 html 文件所在的路径，这个 html 文件名字默认去寻找 index.html 文件.如果我们需要依赖其他 html 文件那么就需要配置 filename。

> 其实 devSever 实质上也是在我们修改代码的时候自动帮我们构建代码然后实现更新，所以 devServer 打包后的资源（比如 js 文件）就会放在 contentBase 下的目录中。可以这样讲，devServer 需要依赖 contentBase 指向的 html 文件，同时他也会将打包后的文件存在放 contentBase 目录中去（虚拟目录看不到）。

> 注意，如果项目中配置了 html-webpack-plugin 的话那么 contentBase 我的实践中会无效，她不会去根据配置路径去寻找 html 文件而是会启动 html-wepback-plugin 生成的 html 文件，即使 conetentBase 路径和生成的 html 路径不一致。会以 html-webpack-plugin 路径为准。

> 官网给出的解释是：告诉 devServer 寻找静态资源的路径，只有在需要提供静态资源的时候才会这么做（比如 html 文件）。

> contentBase 可以传递一个 String 代表生成静态资源路径和生成静态资源存放路径，也可以传递一个 Array[String],表示在多个文件中 dev 服务可以去寻找静态资源。

> 关于 contentBase 的确也踩了坑，谨记一句话：告诉 devServer 生成的静态资源比如打包后的 js 文件存放的目录以及同时告诉 devServer 启动服务依赖的静态资源在哪里（比如需要依赖的 html 文件）。但是在配置后 html-webpack-plugin 失去效果。（所以平常项目中如果使用 html-webpack-plugin 就无需配置 contentBase）。

- open
- port
- proxy:如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。

```
 proxy:  {
     // /api开头的请求转发到3000下
     // /api/test -> http://localhost:3000/api/test
     "/api": "http://localhost:3000"
 }

```

- publicPath
- historyApiFallback
  > 说到 historyApiFallback 一定要介绍两种路由跳转方式。
  > 关于 Hash 和 History 路由区别和原理可以参考我的另一篇文章有详细介绍区别[router 模式区别和实现原理](https://github.com/19Qingfeng/Router-way)

> HistoryApiFallback 针对于 H5 History 路由进行设置的，就比如 vue-router 中的 history 模式。比如我们访问 localhost:8080/list 这个页面，devserver 会直接去寻找/list 的资源但是这个时候并不存在这个资源这是我们前端路由设置的。所以可以使用 HistoryApicallback 设置访问不到重定向当主页然后代码就会根据 url 识别前端匹配到前端自己的路由。

```
devServer: {
    historyApiFallback: true
}
// 也可以配置重写进行匹配路径
module.exports = {
  //...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' }
      ]
    }
  }
};
// 当然还可以配置一个函数
devServer:{
    ...
    hostoryApiFallback:{
        from:/^\/libs\/.*$/,
        to:function(context){
            return `\bower_componets`+ context.parseUrl.pathname
        }
    }
}
```

3. webpack-dev-middlerware
   > 扩展一下。自己搭建一个 nodeServer,使用 webpack-dev-middleware 和 express。

```
script: {
    "middleware":"node server.js"
}

npm install express  webpack-dev-middlerware -D
// 其他配置参考本次commit
```

### Hot Module Replacement

> 关于 HMR 做到的功能我就不在累赘了，热重载现在 cli 项目全都在使用。

> 讲讲之前版本的 hotModuleReplacement。

```
const webpack = require("webpack")
// 之前版本在配置devserver的hot为true的时候还需要额外引入hotModuleReplacment插件
devSercer:{
    ...
    hot:true
},
plugins:[
    ...
    new webpack.hotModuleReplacementPlugin()
]
// 这样才可以启动热更新。
```

> 但是现在新版本的 webpack 中已经自己集成了 hotModuleReplacement 插件了。我们如果需要热更新需要的配置仅仅是在 devServer 中 hot:true 就可以了。

- devServer 热冲载配置项目。
  1. hot:true 开启热重启功能。
  2. hotOnly:true 表示即便 HRM 的功能没有刷新，配置 true 浏览器也不会自动刷新。

---

> 稍微说点关于 HRM 的实际实现。
>
> > 参考本次（HRM）commit 的代码，我们可以发现对于 js 文件不同模块的的 HRM 需要我们使用 HRM 的 accept 语法去做判断独立更新各自的模块。比如:

```
// main.js入口文件
import count from "./HRM/count"
import number from "./HRM/number"

// count这个函数是在页面添加一个div，div的值是1，每次点击都会++。
// number这个函数运行后会在页面添加一个div，div的值是固定的
count()
number()

```

> 这样的写法的话会存在一个潜在的问题。
>
> > 每次当我点击页面很多次，也就是 count 值变化之后。我再去代码中修改 number 的值因为 HRM 的缘故 count 值就会跟随刷新而重制，这显然不是我所需要的样子。
> >
> > > 我需要的是每次在代码中独立更新 number 的值的时候 count 的内容并不会被 HRM 刷新改变。换句话说也就是希望页面每个模块之间独立被 HRM 进行更新。

- module.hot.accept(name,cb)
  1. name 表示传入的模块路径，比如 import 的 js 文件模块。
  2. name 模块发生变化的时候，就会执行 cb 函数。

```
// main.js中 如果当前项目支持热更新
if(module.hot) {
    module.hot.accpet("./HRM/number", () => {
        // HRM会监听当number文件发生变化的时候执行的逻辑
        const numberDom = document.getElementById('number')
        document.body.removeChild(numberDom)
        number()
    })
}
// 这样的话每当我们在代码中修改number模块，那么HRM就会走到上边的处理逻辑中并不会进行全局刷新JS文件了。
// 达到了修改number.js而不影响页面上的count.js的文件和页面状态。
```

- 也就是说我们可以通过 module.hot.accept 这个方法覆盖每个模块文件的 HRM 的默认热更新形式从而达到不去影响别的逻辑（交给我们自己处理），比如上边的代码就覆盖了 number.js 改变的时候 HRM 帮我们执行的逻辑。这样就不会对于每次改变都会刷新整个页面逻辑了。
- 默认不配置 module.hot.accept 的时候每次改变任意文件它就会帮助我们刷新整个页面。

###### 关于 module.hot.accept 的实现

- 其实我们在修改 css 文件的时候发现 css 也是独立模块互不影响的，并不像 js 文件这样全局刷新。引入 CSS 文件的改变理论上我们也应该通过 accept 方法进行监听修改逻辑，这是因为 module.hot.accept 这些逻辑在 css-loader 上底层已经帮我们进行了实现，我们使用 css-loader 的时候就不需要额外实现这段代码了。
- 在 Vue 中我们在书写代码的时候也是模块之间互不影响的，同理其实是 vue-loader 底层帮我们实现了 module.hot.accept 的逻辑。
- React 中借助了一些 babel-preset 内置了 module.hot.accept 各个模块之间的实现。
- 通常项目中我们是不需要额外书写 HRM 的 accept 监听逻辑的，但是如果我们在代码中引入了一些比较偏的文件，比如一些数据文件。这些文件的 loader 中并没有实现 accept()的逻辑，这时候就需要我们实现了。
- 本质上 HRM 都需要实现 accept()方法实现独立更新，但是一些第三方插件已经帮我们实现了。这里的话还是需要给大家说一下，有时候一些文件没有实现那么就需要我们去自己实现了。
- HRM 提供的方法不仅仅是 accept()还有很多，比如 decline()等等，具体使用的时候可以去文档查询。[module-api](https://webpack.js.org/api/hot-module-replacement/#module-api)
- [HRM 实现原理](https://www.webpackjs.com/concepts/hot-module-replacement/)
- 问题待解决:accept 中如果代码出错，控制台并不报错。why？

---

### Babel 处理 ES6 语法

- babel-loader
  > 对于 js 语法需要使用 babel-loader 进行处理转译。
- @babel-core
  > Babel 核心库，识别 ES6 代码转成 AST，再将 AST 转化成 ES5 语法。
- @babel/preset-env
  > 实际上 babel-loader 仅仅是帮助通讯 js 文件和 babel 的桥梁。babel-loader 帮助我们打通了 js 代码和 babel。但是并不会进行转译语法。

> @babel/preset-env 就是 babel 的插件，它帮助我们进行 js 文件的转译。
> @babel/preset-env 包含了大多数 ES6 语法转化成 ES5 的语法规则，使用之后就可以 js 代码翻译了。

###### 当使用了 babel-loader，安装了@babel-core 核心库后，使用了@babel/preset-env 这个插件，一些语法已经可以帮我们转译了。

###### 但是这样还是不够的，对于一些比如 Promise 或者 map 等方法仍然并没有进行翻译，这是因为 preset-env 中并没有包含所有的语法转发规则。

###### 所以我们需要补充这些 preset-env 没有的语法规则。有两种方式。

1. @babel/polyfill
   > 安装后在入口文件中引入@babel/polyfill，就可以使用了。polyfill 中存在所有的语法转译规则，引入后 babel 就会根据 polyfill 进行处理新语法了。
   >
   > > 这样就会存在一个问题，对于我们的代码中仅仅使用了部分的 ES6+语法。但是 polyfill 会帮助我们引入所有的转译规则这样就会造成打包后的代码体积非常大。

- 当然解决 polyfill 全局引入造成体积大的问题可以通过 babel-prest-env 的 useBuiltIns 配置，useBuiltIns:"usage"。

  > [babel](https://babeljs.io/docs/en/babel-polyfill#docsNav)官网解释说：The polyfill is provided as a convenience but you should use it with @babel/preset-env and the useBuiltIns option so that it doesn't include the whole polyfill which isn't always needed. Otherwise, we would recommend you import the individual polyfills manually.
  >
  > > 所以通过 useBuiltIns 结合@babel/preset-env 就可以做到 polyfill 的按需引入减小代码体积。

  > 其实如果使用了 useBuiltIns 配置了 polyfill 的按需引入，比如 usage 之后就可以不用额外自己引入 babel-polyfill 了，它会帮我们自动引入的。

```
// main.js
import "@babel/polyfill";
// webpack.config.js
{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            useBuiltIns: 'usage'
                        }],
                    ]
                }
            },
// 这样就做了polyfill按需引入
// 注意presets的配置是数组形式
```

- 当然 preset-env 不仅仅可以配置 usBuiltIns 还可以配置其他很多属性。
  1. targets,比如下面的配置就告诉 babel 我的代码要跑在 chrome67 以上的版本，所以结合 preset-env，一些语法如果 chrome67 以上就已经只吃了那么就不需要 polyfill 额外转译，这样也就较少了包的体积。
  2. corejs,为 preset-env 声明 corejs 版本，见官网说明:
     > Since @babel/polyfill was deprecated in 7.4.0, we recommend directly adding core-js and setting the version via the corejs option.

```
    {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            useBuiltIns: 'usage',
                            targets:{
                                chrome:"67"
                            }
                        }],
                    ]
                }
            },
```

2. @babel/plugin-transform-runtime
   > 对于日常业务代码 babel-polyfill 可能就已经满足需求了，但是 babel-polyfill 会通过全局变量形式注入一些 Promise，mao 等新语法污染环境。在开发一些 UI 库的时候，打包代码的时候这样并不是很好。
   >
   > > 所以就引入了@babel/plugin-transform-runtime。
   > >
   > > > polyfill 会污染全局形式，但是@babel-plugin-transform-runtime 会以闭包的形式引入，不存在全局污染所以对于类库的编写会更加合适。

```
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

```
options: {
    // 不要缺少env基础语法的转译，无论哪种方式都需要env去转译基础语法。
    presets: [
                        ["@babel/preset-env"]
    ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2, // 默认是false 需要手动改为2
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```

- 关于 corejs:2 配置项。
  1. false 默认用户手动引入特性。
  2. 2 支持全局变量和静态属性。
  3. 3 额外支持实例属性。
  4. 2，3 都要分别额外安装不同的 npm 包。
     > The plugin defaults to assuming that all polyfillable APIs will be provided by the user. Otherwise the corejs option needs to be specified.
     >
     > > 默认 false 表示 transform-runtime 插件认为所以新语法的可以填充的 api 都用用户手动提供，这里配置 2 的意思是说支持全局变量和静态属性，如果需要实例属性需要配置 3，详情可以参照[官网配置](https://babeljs.io/docs/en/babel-plugin-transform-runtime)。
     > >
     > > > 以及修改了 corejs 的配置为 2 后需要额外安装对应的模块，具体还是参照[corejs 配置项手册](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

###### 当然这样在 webpack 中我们去写 babel 的配置那么将会非常的多，我们可以将 babel-loader 的配置放在.babelrc 文件中去进行配置。

**Tips:**

- 日常业务代码使用 polyfill 就可以，对于类库的打包使用 transform-runtime 最佳。
- 无论是 polyfill 还是 transform-runtime 都是对于 ES6 一些内置模块/属性/方法在 ES5 中进行转译的规则，比如 Promise，proxy,reflect 等等通过 ES5 代码实现让低版本浏览器识别。
- babel-preset-env 是将 ES6 语法转译成 ES6 的，比如 let，const 等。
- 所以 polyfill 和 transform-runtime 其实是同一种作用，但是 preset-env 和他们实现的功能是不同的。可以理解为 preset-env 是基础，所以无论 polyfill 还是 transform-runtime 这两种补充内置模块转译的规则，仍然都需要使用 env 去转译基础语法。

### Vue 和 React

- Vue 使用 [vue-loader](https://vue-loader.vuejs.org/) 就不过多累赘了。
- React 需要使用 [babel-preset-react](https://babeljs.io/docs/en/babel-preset-react) 插件，注意顺序。

```
{
    // 从下往上 先使用react处理js文件识别react代码
    // 在使用preset-env处理ES6+语法转换
    "presets": [
        ["@babel/preset-env"],
        ["@babel/preset-react"]
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime", {
            "absoluteRuntime": false,
            "corejs": 2, // 默认是false 需要手动改为2
            "helpers": true,
            "regenerator": true,
            "useESModules": false,
            "version": "7.0.0-beta.0"
        }]
    ]
}
```

###### 至此，webpack 基本内容结束。

---

## Webpack 高级概念

### TreeShaking

> TreeShaking 的意思是说 webpack 对于一些 ES Module 引入方式，打包后删除模块中并没有被项目引入到的代码。也就是引入什么打包什么，按需加载。
>
> > 注意：TreeShaking 仅仅对于 ES Module 生效。

- Tree Shaking 只支持 ES Module 方式的引入，因为 ES Module 是静态引入。
  > import 底层是静态引入，require commonjs 这种是动态引入。TreeShaking 仅支持静态引入。
- Tree Shaking 在 production 下默认会开启。
- Tree Shaking 在 devlopment 下其实没有必要配置，但是我们为了演示去配置开发环境：

```
// 开发环境下配置
// webpack.config.js
module.exports = {
  ...
  optimization:{
    // 开启TreeShaking
    usedExports:true
  }
}

// package.json
sideEffects:false
// 它表示的是如果配置了Tree Shaking那么webpack只要打包一个模块就会使用TreeShaking去处理
// sideEffects配置项是表示让TreeShaking对于匹配文件进行忽略，也就是对应模块不使用TreeShaking
// false表示全部开启TreeShaking
```

- Tips:
  > 对于一些没有导出的模块，比如 css 文件或者引入的 babel-polyfill 等

```
import "./index.css"
import "@babel/polyfill"
```

> 这些文件并没有导出使用，比如 polyfill 而是在全局添加一些变量，css 文件也没有导出任何但是我们仍然要使用。

> 这个时候就不能让 Tree Shaking 对于这些代码进行处理，那么就要进行配置 sideEffects 了。

```
sideEffects:[
  "@babel/polyfill",
  "**/*.css",
  "**/*.scss",
  "./esnext/index.js",
  "./esnext/configure.js",
  "*.css"
]
```

- 这时候再去打包的话就会发现在 development 环境下会多了两行注释(参考 Demo):

```
/* unused harmony export sum */
/* unused harmony export dele */
      var sum = function sum(a, b) {
        console.log(a + b);
      };
      var dele = function dele(a, b) {
        console.log(a - b);
      };

```

> 为什么没有删除呢？我明明配置了 TreeShaking。

> 这是因为在 development 模式下，其实并不需要配置 treeShaking。即便是我们进行了配置，webpack 也并不会在 dev 下真正的删除，仅仅会用注释标记哪些会被删除哪些有用。
>
> > 这么处理的原因是在 dev 环境下生成的代码一般都是需要做调试的，如果 TreeShaking 在 dev 下删除了没有引入的代码，那么就会造成 sourceMap 对应行数映射之类都会错了。

- 但是在 production 模式下，TreeShaking 会自动生效的。

- 需要注意的是 production 模式下，package.json 的 sideEffects 一定不要忘记配置。否则就会忽略一些文件从而产生错误。

* 关于 TreeShaking 需要注意的点。

  1. webpack 默认如果不在 package.json 中进行配置 sideEffects 那么它仅仅对于 js 类库模块的导出会做 TreeShaking，并不会对于 CSS 文件处理 TreeShaking。

  2. 如果设置 sideEffects:false，那么就会对所有文件 TreeShaking，就会处理 CSS 文件了（忽略）。

  3. 如果对于类库进行了配置 sideEffects，那么一定不要忘记加上\*.css 配置，否则就会忽略 css 文件。

     > 总而言之，默认如果不进行配置 sideEffects 的话那么 TreeShaking 并不会对 css 生效，但是一旦进行了配置，那么不想让 TreeShaking 的模块一定要在 sideEffects 中进行处理。

> TreeShaking 概念，打包时候引入模块仅仅引入使用到的代码。仅仅支持 ES Modules 静态引入。

> 总之配置 TreeShaking 的话，生产环境默认开启。无论如何在 packagege.json 中 sideEffects 我们手动配置上就不会有意外了

### Production 和 Development 模式区别

> 区别不做过多解释了，日常开发大家都清楚。

> 这里主要使用 webpack-merge 进行合并。

```
npm install webpack-merge -D

const { merge } = require("webpack-merge")
// webpack.dev.js
const common = require("./webpack.common.js")
const devConfig = { ... }
module.exports = merge(common,devConfig)
// webpack.prod.js
const common = require("./webpack.common.js")
const prodConfig - { ... }
module.exports = merge(common,prodConfig)
```
