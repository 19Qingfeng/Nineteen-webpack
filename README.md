# 19-webpack

webpack。<br>

webpack4. X 常用配置以及性能优化。更新中 ing

webpack工作中遇到的各种问题整合。

&nbsp;&nbsp; <a href="#1">1. Webpack 基础内容</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-1">1-1. 什么是 loader-常用 loader</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-1-1">1-1-1. loader 处理图片</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-1-2">1-1-2. loader 处理样式文件</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-1-3">1-1-3. loader 处理字体文件</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href="1-2">1-2. 常用 Plugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-1">1-2-1. HTML-webpack-plugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-2">1-2-1. Clean-webpack-plugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-3">1-2-3. mini-css-extract-plugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-4">1-2-4. optimize-css-assets-webpack-plugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-5">1-2-5. webpack.DllPlugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#1-2-6">1-2-6. webpack.DllReferencePlugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href='#1-2-7'>1-2-7. AddAssetHtmlWebpackPlugin</a>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href='#1-2-8'>1-2-8. define-plugin</a>

&nbsp;&nbsp; <a href="#2">2. Entry 和 Output 的基础配置</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href="#2-1">2-1. entry</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href="#2-2">2-2. output</a>

&nbsp;&nbsp; <a href="#3">3. SourceMap</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href='#3-1'>3-1. sourceMap 配置建议</a>

&nbsp;&nbsp; <a href="#4">4. DevServer</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href='#-1'>4-1. webpack's Watch Mode</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href='#4-2'>4-2. webpack-dev-server</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href='#4-3'>4-3. webpack-dev-middlerware</a>

&nbsp;&nbsp; <a href="#5">5. Hot Module Replacement</a>

&nbsp;&nbsp;&nbsp;&nbsp; <a href='#5-1'>5-1. HMR 原理(module.hot.accept)</a>

## webpack 基础内容讲解

---

### <a name='1-1'>1.1 什么是 loader？</a>

> webpack 默认知道如何打包 js 文件，对于一些 css，图片，字体等非 js 文件需要使用使用 loader 去处理让 webpack 识别通过 loader 处理。
> <br>

File-loader 举例 -> 当 webpack 碰到 test 匹配的.jpeg 结尾的文件就会交给 use 的 file-loader 处理。<br>

- 首先遇到 test-img.jpeg 会将它移动到 dist 目录下，同时会修改名称。(文件移动到打包目录下)
- 然后得到一个图片相对与 dist 目录的一个名称然后讲名称返回给 require 的变量 default 属性中。(同时获得移动文件的地址)

其实 loader 就是一个特定方案，让 webapck 对一些不支持的文件通过 loader 认识他们并且进行打包。<br>

webpack 对于非 js 文件通过 loader 进行识别。<br>

module 中的 rules 进行配置。

#### <a name="1-1-1">1.1.1 使用 loader 打包静态资源(图片)</a>

- 处理图片资源 File-loader 和 Url-loader。

- url-loader 和 file-loader 配置和相似，url-loader 会将配置小于 limit(单位为 btye 1024 -> 1Kb)会转化为 base64。

#### <a name="1-1-2">1.1.2 使用 loader 处理样式文件</a>

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

#### <a name="1-1-3">1.1.3 使用 loader 处理字体文件</a>

- file-loader 帮助 webapck 识别 ttf, eot, woff 等格式的字体文件处理。
- file-loader 配置和 url-loader 类似，其实 fileloader 也可以处理图片文件，只不过 url-loader 存在 limit 配置可以转成 base64.
- file-loader 其实可以处理的文件类型有很多做，简单来说他的作用就是将这些匹配文件打包后放在 output 中去。

### <a name='1-2'>Plugin</a>

Plugin 本质上就是在 webpack 运行到某个时刻的时候，帮我们做一些事情，类似生命周期函数。

#### <a name='1-2-1'>[HTML-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)</a>

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

#### <a name='1-2-2'>[Clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)</a>

> 并非官方推荐，
> 打包运行前进行之前打包文件的删除。默认可以不传递任何参数。

- 常用配置 1. dry: 默认 false，删除 mock 文件。 2. verbose: 打印信息。

  ...

  > 之前配置更新了。。用到的还是查文档吧。。更新太快了。

#### <a name='1-2-3'>[mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)</a>

默认 webpack 会将 css 文件使用 style-loader 添加到页面 head 标签的 style 中去。(css in js)

**使用 mini-css-extract-pluginn 提供的 loader 代替 style-loader 进行拆分**。

```
npm install --save-dev mini-css-extract-plugin

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 代替CSsloader
module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

- 配置参数

  1. filename:拆分的 css 文件直接被页面引入，走 filename。
  2. chunkFilename:被页面间接引入的 css 文件，走 chunkFilename。
  3. Minimizing For Production

     > 默认生成的 css 文件不会被压缩，使用 optimize-css-assets-webpack-plugin 进行压缩生成的 css 文件。

  4. 关于 MiniCssExtractPlugin 底层其实也是根据 splitChunksPlugin 去拆分的，所以如果需要一些更高级的配置，比如[根据入口文件拆分 css 或者合并多个 css 文件进行一个 css 文件](https://webpack.js.org/plugins/mini-css-extract-plugin/#extracting-all-css-in-a-single-file)。[具体都可以参照官网进行配置 splitchunks 的 cachegroup](https://webpack.js.org/plugins/mini-css-extract-plugin/#root)

#### <a name='1-2-4'>[optimize-css-assets-webpack-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)</a>

> 配合 mini-css-extract-plugin 生成的 css 文件进行压缩。optimization 中 minimizer 的配置项。

```
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

#### <a name='1-2-5'>webpack.DllPlugin</a>

> DllPlugin 仅仅针对 dev 环境有效，在 production 环境下是无效的。(生成 mainfest)

**tips:Dllplugin 的 name 配置必须和 output 的 library 一致。**

#### <a name='1-2-6'>webpack.DllReferencePlugin</a>

#### <a name='1-2-7'>AddAssetHtmlWebpackPlugin</a>

```
npm i add-asset-html-webpack-plugin -D
```

> 这三个文件的配合使用详见 Webpack 性能优化。

#### <a name='1-2-9'>[define-plugin](https://www.webpackjs.com/plugins/define-plugin/)</a>
```
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object")
})
console.log("Running App version " + VERSION);
if(!BROWSER_SUPPORTS_HTML5) require("html5shiv");
```
> 注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。

Vue-cli3.x中环境变量最终基于这个插件去增加的。

工作中有碰到运维为了统一env后缀文件配置，在vue-cli3.x脚手架下项目增加环境变量文件为env.config而为官方的.env.config。

目前实现的办法是通过定义env.config然后在打包过程中通过node的fs模块去读取文件内容进行解析成为一个对象，然后得到环境变量对象添加到definePlugin中实现效果。

###### 遗留问题

1. vue-cli3.x中使用上述方法(fs+defineplugin)定义process.env.xxx，xxx并不在对象内部而是。简单来说:
```

console.log(process.env)

// 打印 { NODE_ENV:'produciton',BASE_URL:"" }

console.log(process.env.VUE_HTTP_REQUSET) // 'www.baidu.com'

// 很奇怪
```

2. 一定还有其他更好的方式，等待寻找。


---

### <a name='2'>Entry 和 Output 的基础配置</a>

#### <a name='2-1'>entry</a>

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

#### <a name='2-2'>output</a>

> 打包出口文件

```
output: {
    // 打包生成的文件名称
    filename:"[name].[hash].js",
    // 生成的文件打包后放在的path路径
    path:path.resolve(__dirname,"dist"),
    // publicPath:将打包后的静态资源路径添加publicPath的路径
    // 重新打包后，文件的路径都会增加http://cdn.com.cn的前缀。（关于publicPath后边会相详细讲解）
    publicPath:"http://cdn.com.cn",
    chunkFilename:"[name].chunk.js"
}
```

chunkFilename: 对于非 enrty 的 js 文件(code splitting 分割出的 chunks)命名规则。

Code Splitting 和 webpackChunkName 仅仅写的是 name。

然后在出口统一会经过 chunkFilename 的处理。

### <a name='3'>SourceMap</a>

> sourceMap 作用：它是一个映射关系，如果代码有报错，通过 sourceMap 可以将打包后代码出错的地方映射到源码中出错的地方。

> 经过映射的转化我们也就可以快速精准的定位问题。

#### devtool (sourceMap 配置属性)

###### [devtool 配置属性和对应构建速度](url)

> Tips:

- 配置 sourceMap 后打包后的代码会对应出现 map.js 文件，她其实就是存放映射关系的(非 inline)。

- inline: 如果添加一个 inline，就会将打包生成的 js 文件和.map 合并。map 文件变成 base64 文件放在打包后 js 文件底部。

- cheap：（增加构建速度）

  1. 只提示多少行出错并不提示多少列出错
  2. 只负责业务代码的错误，第三方插件错误并不会提示（比如 loader 的错误并不会提示）

- module:cheap 中存在 module，就是表示 cheap 打包后的代码，提示错误不仅会管理业务代码还会管理第三方模块的错误。

- eval: 通过 eval 方式进行代码打包，eval 执行形式进行打包映射对应错误。（并不会生成.map，构建速度最快的方式）。

###### <a name='3-1'>sourceMap 配置建议。</a>

- development 建议: 建议使用 cheap-module-eval-source-map 这种方式 提示比较全同时打包速度比较快的。
- production 建议：绝大多数不需要 sourceMap 配置，如果出现问题可以配置 cheap-module-source-map 线上代码有问题也可以定位错误。

### <a name='4'>DevServer</a>

> 每次都需要打包后打开 html 进行查看，devserve 帮助我们在本地启动一个 node 环境解决这个问题。

1. <a name='4-1'>webpack's Watch Mode</a>

```
// package.json:
scripts: {
    "watch":"webpack --watch"
}
```

--watch 这个参数，监控到 webpack 所需要打包的代码发生改变。会自动执行打包代码，但是他并不会帮助我们起一个服务器。就意味着打包生成的文件是在本地访问。没有办法去做一些 ajax 的请求调试，而且每次打包过后都需自己手动刷新浏览器。

2. <a name='4-2'>webpack-dev-server（推荐）</a>

> webapck 内部已经内置了 devServer 的配置，但是注意我们还是需要安装 webpack-dev-server 这个插件。

- index：默认识别 html 文件名为 index.html，如果生成 HTML 的文件名非 index，则需要在 index 配置中改成对应的才可以正确启动。

  > HTML template is required to serve the bundle, usually it is an index.html file. Make sure that script references are added into HTML, webpack-dev-server doesn't inject them automatically.

- contextBase: 指定静态资源的根目录的，意思就是不受 webpack 控制的资源文件。读取的路径，比方在没有设置 htmlwebpackplugin 的时候，devserver 会根据 contentbase 的目录去查找到对应 html 文件从而打开。但是一旦使用了 htmlwebpackplugin，contentbase 就会没有效果。htmlwebapckplugin 生成的文件 devserver 会直接打开而忽略 contentbase 配置。

  > contentBase，首先 devserver 需要依赖一个 html 文件去进行打开我们的网页然后实现启动服务监听，所以 contentBase 指向的路径就是 devServer 所依赖的 html 文件所在的路径，这个 html 文件名字默认去寻找 index.html 文件. 如果我们需要依赖其他 html 文件那么就需要配置 filename。

> 其实 devSever 实质上也是在我们修改代码的时候自动帮我们构建代码然后实现更新，所以 devServer 打包后的资源（比如 js 文件）就会放在 contentBase 下的目录中。可以这样讲，devServer 需要依赖 contentBase 指向的 html 文件，同时他也会将打包后的文件存在放 contentBase 目录中去（虚拟目录看不到）。

> 注意，如果项目中配置了 html-webpack-plugin 的话那么 contentBase 我的实践中会无效，她不会去根据配置路径去寻找 html 文件而是会启动 html-wepback-plugin 生成的 html 文件，即使 conetentBase 路径和生成的 html 路径不一致。会以 html-webpack-plugin 路径为准。

> 官网给出的解释是：告诉 devServer 寻找静态资源的路径，只有在需要提供静态资源的时候才会这么做（比如 html 文件）。

> contentBase 可以传递一个 String 代表生成静态资源路径和生成静态资源存放路径，也可以传递一个 Array[String], 表示在多个文件中 dev 服务可以去寻找静态资源。

关于 contentBase 的确也踩了坑，谨记一句话：**告诉 devServer 生成的静态资源比如打包后的 js 文件存放的目录以及同时告诉 devServer 启动服务依赖的静态资源在哪里（比如需要依赖的 html 文件）。**但是在配置后 html-webpack-plugin 失去效果。（所以平常项目中如果使用 html-webpack-plugin 就无需配置 contentBase）。

- open
- port
- proxy: 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。(接下来会深入讲配置)

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
            return `\bower_componets` + context.parseUrl.pathname
        }
    }
}
```

3. <a name='4-3'>webpack-dev-middlerware</a>

   > 扩展一下。自己搭建一个 nodeServer, 使用 webpack-dev-middleware 和 express。

```
script: {
    "middleware":"node server.js"
}

npm install express  webpack-dev-middlerware -D
// 其他配置参考本次commit
```

### <a name='5'>Hot Module Replacement</a>

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

#### <a name="5-1">HMR 原理</a>

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

这样的写法的话会存在一个潜在的问题。

每次当我点击页面很多次，也就是 count 值变化之后。我再去代码中修改 number 的值因为 HRM 的缘故 count 值就会跟随刷新而重制，这显然不是我所需要的样子。

我需要的是每次在代码中独立更新 number 的值的时候 count 的内容并不会被 HRM 刷新改变。**换句话说也就是希望页面每个模块之间独立被 HRM 进行更新。**

- module.hot.accept(name, cb)
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

- 也就是说我们可以**通过 module.hot.accept 这个方法覆盖每个模块文件的 HRM 的默认热更新形式从而达到不去影响别的逻辑（交给我们自己处理**），比如上边的代码就覆盖了 number.js 改变的时候 HRM 帮我们执行的逻辑。这样就不会对于每次改变都会刷新整个页面逻辑了。

- 默认不配置 module.hot.accept 的时候每次改变任意文件它就会帮助我们刷新整个页面。

###### 关于 module.hot.accept 的实现

- 其实我们在修改 css 文件的时候发现 css 也是独立模块互不影响的，并不像 js 文件这样全局刷新。引入 CSS 文件的改变理论上我们也应该通过 accept 方法进行监听修改逻辑，这是因为 module.hot.accept 这些逻辑在 css-loader 上底层已经帮我们进行了实现，我们使用 css-loader 的时候就不需要额外实现这段代码了。

- 在 Vue 中我们在书写代码的时候也是模块之间互不影响的，同理其实是 vue-loader 底层帮我们实现了 module.hot.accept 的逻辑。

- React 中借助了一些 babel-preset 内置了 module.hot.accept 各个模块之间的实现。

- 通常项目中我们是不需要额外书写 HRM 的 accept 监听逻辑的，但是如果我们在代码中引入了一些比较偏的文件，比如一些数据文件。这些文件的 loader 中并没有实现 accept()的逻辑，这时候就需要我们实现了。
- 本质上 HRM 都需要实现 accept()方法实现独立更新，但是一些第三方插件已经帮我们实现了。这里的话还是需要给大家说一下，有时候一些文件没有实现那么就需要我们去自己实现了。

- HRM 提供的方法不仅仅是 accept()还有很多，比如 decline()等等，具体使用的时候可以去文档查看。[module-api](https://webpack.js.org/api/hot-module-replacement/#module-api)

- [HRM 实现原理](https://www.webpackjs.com/concepts/hot-module-replacement/)

- 问题待解决:accept 中如果代码出错，控制台并不报错。why？

---

### resolve 参数

> resolve 参数也就是告诉 webpack 配置方便开发的模块解析规则。

resolve 参数是告诉 webpack 如何解析模块的规则，也就是使用 resolve 更改 webpack 查找文件位置。

- extensions

尝试按顺序解决这些扩展名。就比如在 Vuecli 创建的项目其实我们引入 js 文件并不用书写后缀，这就是 extensions 的配置结果。

```
resolve: {
    // 从左到右依次顺序去寻找匹配后缀文件
    extensions: ['.js', '.vue', '.css', '.json']
}
```

> 注意如果不进行配置 extensions 的话 webpack 默认是存在默认配置的，一旦配置 extensions 就会覆盖。

- mainFiles

解析目录时要使用的文件名。告诉 Webpack 在引入文件夹时(不显示指明文件名)默认去该文件夹内部哪些文件去查找。(默认 index 配置)

```
// 优先匹配index,然后index没有再去寻找wanghaoyu 后缀名不写的话仍然按照extensions查找。
module.exports = {
  //...
  resolve: {
    mainFiles: ['index','wanghaoyu']
  }
};
```

- alias

创建别名 import 或 require 某些模块更容易,也就是别名。

```
module.exports = {
  //...
  resolve: {
    alias:{
      wanghaoyu:path.resolve(__dirname,"../test")
    }
  }
}

// 代码文件中
// 其实就是在使用import或require的一些别名。
// 当引入路径看到了设置的alias(wanghaoyu)的时候，他就会执行我配置的路径匹配。
import Test from "wanghaoyu/one.vue"
```

> alias,extensions,mainFiles 这三个其实都存在 Webpack 的默认配置，当我们不设置的时候。

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

- 当然解决 polyfill 全局引入造成体积大的问题可以通过 babel-preset-env 的 useBuiltIns 配置，useBuiltIns:"usage"。

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
     > 使用@babel/prest-env 配合 babel-polyfill 的按需引入，也就是 useBuiltIns 选项时候，要求显示指明 corejs 版本，否则默认为 2.x 并且打包时候提示 warming。
     > 以及使用 corejs，不要忘记按照，corejs 配置区别见下方 transfrom-runtime。

```
    {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            useBuiltIns: 'usage',
                            corejs:"3",
                            targets:{
                                chrome:"67"
                            }
                        }],
                    ]
                }
            },
```

2. @babel/plugin-transform-runtime

   > 对于日常业务代码 babel-polyfill 可能就已经满足需求了，但是 babel-polyfill 会通过全局变量形式注入一些 Promise，map 等新语法污染环境。在开发一些 UI 库的时候，打包代码的时候这样并不是很好。
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
  3. 3 不仅支持全局变量和静态属性，还额外支持实例属性。
  4. 2，3 都要分别额外安装不同的 npm 包。

     > The plugin defaults to assuming that all polyfillable APIs will be provided by the user. Otherwise the corejs option needs to be specified.
     >
     > > 默认 false 表示 transform-runtime 插件认为所以新语法的可以填充的 api 都用用户手动提供，这里配置 2 的意思是说支持全局变量和静态属性，如果需要实例属性需要配置 3，详情可以参照[官网配置](https://babeljs.io/docs/en/babel-plugin-transform-runtime)。
     > >
     > > > 以及修改了 corejs 的配置为 2 后需要额外安装对应的模块，具体还是参照[corejs 配置项手册](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

###### 当然这样在 webpack 中我们去写 babel 的配置那么将会非常的多，我们可以将 babel-loader 的配置放在.babelrc 文件中去进行配置。

###### 以及对于一些新的 ES9, 10, 11 等语法 babel 还需要额外的插件进行支持，具体不支持用到了去查官网引入安装就好了。

**Tips:**

- 日常业务代码使用 polyfill 就可以，对于类库的打包使用 transform-runtime 最佳。
- 无论是 polyfill 还是 transform-runtime 都是对于 ES6 一些内置模块/属性/方法在 ES5 中进行转译的规则，比如 Promise，proxy, reflect 等等通过 ES5 代码实现让低版本浏览器识别。
- babel-preset-env 是将 ES6 语法转译成 ES6 的，比如 let，const 等。
- 所以 polyfill 和 transform-runtime 其实是同一种作用，但是 preset-env 和他们实现的功能是不同的。可以理解为 preset-env 是基础，所以无论 polyfill 还是 transform-runtime 这两种补充内置模块转译的规则（比如 ES6 内置的 Promise），仍然都需要使用 env 去转译基础语法。

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

> 结论：在看了很多第三方库的源码后，终于发现 TreeShaking 对于很多第三库其实是不支持的。因为他们源码写法的缘故所以无法被 TreeShaking。

> 至于如何解决第三方类库无法被 TreeShaking，需要我们自己动手写一个 loader 处理相应库，这部分代码我在后边补充。

> TreeShaking 的意思是说 webpack 对于一些 ES Module 引入方式，打包后删除模块中并没有被项目引入到的代码。也就是引入什么打包什么，按需加载。
>
> > 注意：TreeShaking 仅仅对于 ES Module 生效。

需要注意的是，在 webpack 中 TreeShaking 仅仅针对 ESM 生效，对 CJS 方式无效。而在其他一些第三方库中由于实现方式不同所以可以实现对 CJS 的 TreeShaking。

比如 Rollup 中使用@rollup/plugin-commonjs 插件后，就可以识别使用 CJS 的方式了。同时对于 export.xx 这种方式它也会进行 TreeShaking。

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

- 关于 TreeShaking 需要注意的点。

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

### Code Splitting

> 其实 Code Splitting 并不是 webpack 中的概念，在没有 webpack 之前就已经存在 Code Splitting 了。
> 只不过是 Webpack 帮我们更方便的进行 Code Splitting。

- webpack 中二种代码分割方式。

  1. 通过 entry 手动进行代码分割。

  2. 通过 SplitChunksPlugin 进行代码分割进行重复数据删除和拆分。(Webpack4+这个插件已经不需要额外引入了，集成在了 optimization 中的 splitChunks)

  3. 动态引入。（异步引入的代码会被自动分割）

1. 传统方式的手动代码分割：使用 entry 分割。

```
// 比如我们代码中引入了lodash
// lodash.js
import _ from "lodash"
// window手动挂载提供其他页面使用
// 单独手动拆分lodash成一个文件在入口配置中进行单独打包
window._ = _
```

```
// 业务逻辑代码
...
```

```
// 配置文件 通过多入口进行CodeSplitting
// 注意打包的顺序 entry配置入口文件顺序
// 比如这里我们先引入了lodash在挂载在window上然后main才使用
// 否则先打包main就会报错的，main先打包的话并没有挂载lodash呢也就无法使用
...
entry: {
  lodash:path.resolve(__dirname,"../src/lodash.js"),
  main:path.resolve(__diranme,'../src/main.js'),
}
```

> 这样就拆分出来的 lodash 和 main 代码，这是传统方式的手动 Code Splitting。

2. optimization - splitChunks

- 同步代码分割

```
// 对于同步引入代码也会进行了分割
optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
```

- 异步代码分割(异步引入代码一定会进行分割，无论是否匹配到 splitChunks 的条件)

```
// 并没有配置optimization中的splitChunks

```

> 其实这就是 webpack 中的 Code Splitting。

###### Tips:

- Webpack 在做同步代码引入的时候，会根据 optimization 中的 splitChunks 配置。满足条件进行代码分割。
- Webpack 对于异步代码的引入方式，是一定会将异步引入的代码分割的。

  > 因为异步引入的话只有需要的时候才会引入，所以是会自动分割出来的。需要的时候才会进行加载。

### SplitChunks

> 进一步带大家来了解 SplitChunksPlugin，optimization 中的 splitChunks 底层就是这个插件。

#### 首先说一下异步代码的魔法注释[Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments)

- webpackIgnore：设置为时，禁用动态导入解析 true。表示异步代码并不进行 Code Splitting。

- webpackChunkName：新块的名称。异步组件代码分割命名。

- webpackPrefetch/webpackPreload 之后会专门讲。

- webpackMode：自 webpack 2.6.0 起，可以指定用于解决动态导入的不同模式。选项去查官网吧，有 lazy 模式。

```
// Single target
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackExports: ["default", "named"] */
  'module'
);

// Multiple possible targets
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
 `./locale/${language}`
);
```

#### SplitChunks 配置

**首先放结论: 关于同步和异步代码分割**

- 如果配置 splitChunks 中的 chunks 为 all。

  - 如果通过同步代码引入，进入 splitChunks 配置。满足-分割，不满足-不分割。

  - 如果异步代码引入，同样会进入 splitChunks 配置。满足-匹配进入分组, 不满足-不进入分组(还是会分割，只不过完全按照 Magic Comments 的配置)。除非设置 webpackIgnore:false 才会不分割异步代码。

- 如果配置为 initial

  - 同步代码，同样逻辑。

  - 异步代码，不会进入 optimization 中的 splitChunks 配置，会按照自己的魔法注释分割。

- 如果配置为 async

  - 同步代码不进入。

  - 异步代码进入配置匹配项，匹配-进入分组 cacheGroup，不匹配按照自己魔法注释分割。

_splitChunks 如果没有配置，存在默认配置项:_

```
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // initial（同步），all（所有），async(同步)
      chunks: 'all',
      // 生成块的最小字节大小，当包小于minSize规定的字节大小时不进行代码分割配置(注意区分同步异步)
      minSize: 20000,
      // 不常用，他的值是将打包分割后的库尝试进行二次拆分，尝试将打包后的代码按照maxSize的大小进行拆分成多个文件。
      // 如果分割的chunk大于maxSize的值会尝试拆分成为maxSzie大小，如果无法二次分割还是不会分割。
      maxSize: 0,
      // 当一个模块至少被使用次数达到要求之后才会进行分割
      // 注意是chunks 表示被打包生成的chunk引入的次数
      // 打包后的js文件每一个文件都可以理解为一个chunk
      minChunks: 1,
      // 按需加载时并行请求的最大数量，也就是同时加载模块数。
      // 如果超过30个chunks 也就是请求会同时发起超过30个 那么在30个包后就不会进行分割了
      maxAsyncRequests: 30,
      // 入口点上并行请求的最大数量，首页代码进入分割的最多个数
      // 也就是网站入口文件中通过代码分割进行最多的分割数
      maxInitialRequests: 30,
      // 默认情况下，webpack将使用块的来源和名称生成名称（例如vendors~main.js）。此选项使您可以指定用于生成名称的定界符。
      // 也就是匹配满足splitChunks条件的时候会进入对应的cacheGroup生成文件名为：
      // cache组名~文件名 文件生成时候的链接符 （vendors~main.js中的~）
      automaticNameDelimiter: '~',
      // 强制执行拆分的大小阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

- cacheGroups 拿出来单独说。

  > cacheGroups 缓存组，根据 test 匹配的模块存放的路径。在各个文件引入的时候先缓存在各自的组里。当最终所有模块分析好后，按照各自组进行打包对应 chunk。

  > 缓存组可以继承和/或覆盖 splitChunks.\*; 中的任何选项。他可以配置任何 splitChunks 中的配置进行覆盖，但是她也拥有一些自己的配置
  > splitChunks 条件会进入 cacheGroup 中的按照组条件进行 Code Splitting。

  - priority: 一个模块可以属于多个缓存组。优化将优先选择具有较高的缓存组 priority。默认组的优先级为负，以允许自定义组获得更高的优先级（默认值适用 0 于自定义组）。

  - reuseExistingChunk: 如果当前块包含已经从主包中分离出来的模块，那么它将被重用，而不是生成一个新的模块。这可能会影响块的文件名。（举例 a，b 两个模块，一个页面中引入 a，b。但 a 中又使用了 b 模块，在打包 a 的时候符合要求会打包，正常来说在打包 a 的时候因为 a 引入了 b。所以 b 也会进入分割和 a 同一个组中。reuseExistingChunk：true 他会发现之前已经引入过 b.js，所以在 a 中引入 b 的时候他会直接去复用之前的代码。）(仅仅影响块文件名，true 复用不移动缓存组，true 移动模块到新缓存组)

  - test: 控制此缓存组选择的模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或块名称。匹配块名称时，将选择块中的所有模块。

  - default: 默认组名（当以上都不存在时进入 default，前提是满足 splitChunks 外置匹配条件进入组匹配后）。

  - filename: 配置 filename 后该 cacheGroup 生成的文件不在被称作组名+文件名了，而是直接被叫做 filename。这可以在我们进行第三方库打包时候进行配置，比如 elementui 匹配的 cachegroup 那么生成的就叫做 elementui.js。

  - enforce: 通知 Webpack 忽略 splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests 以及 splitChunks.maxInitialRequests 选项并始终为此缓存组创建块。(缓存组配置，也就是告诉 webpack 只要该缓存组匹配成功忽略上述几项进行拆分)

  > 官网解释: This option can also be set globally in splitChunks.filename, but this isn't recommended and will likely lead to an error if splitChunks.chunks is not set to 'initial'. Avoid setting it globally.
  > 缓存组设置 filename 时，在 chunks 项配置为 inital 时才会生效，我们分割同步代码时，可以设置 chunk 为 inital，这样就可以自定义 filename 了。否则会报错。

  - 其他用到了查官网吧。

```
cacheGroups: {
          // cacheGroups当打包同步代码的时候，上边的参数会有效同时会继续往下根据
          // cacheGroups决定分割的代码放在哪个组中。
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // 可以在不同的grouops中添加filename
          // 如果不添加名称就为组名+名称
          // 添加之后单纯就是 filename 不推荐这样全局设置
          // filename:"[name].vendors.js"
          priority: -10
        },
        svgGroup: {
          test(module, chunks) {
            // `module.resource` contains the absolute path of the file on disk.
            // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
            const path = require('path');
            return module.resource &&
                 module.resource.endsWith('.svg') &&
                 module.resource.includes( `${path.sep}cacheable_svgs${path.sep}` );
          }
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
}
```

###### reuseExistingChunk 配置有点吃不透，先 mark 常用配置为 true。等待周六补充下。

#### splitChunks/optimization-splitChunks 一些坑

> 我现在使用的版本是 webpack4.44.1。

- 关于 cacheGroup

```
// 官网并没有指出 cacheGroup存在一个默认的分组
// 如果不显示关闭 那么它一直会存在
// 我代码理的vendors如果我不进行配置他也是会一直存在 所以的的node_modules的代码一直会进入vendors里面去。
// 解决这个问题 要么是使用vendors 要么直接关闭 用自己的分组 要么使用有衔接priority解决
// 官网并没有指出 已经更新为defaultVendors 但是实际我的配置还是会进入vendors
cacheGroups: {
                vendors: false,
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: "lodash",
                    priority: -10,
                    reuseExistingChunk: false
                },
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
```

### Lazy Loading

> Lazy Loading 懒加载其实在 Vue 或者 React 中特别常见，就比如路由懒加载。实际上就是动态 import。

> Lazy Loading 实际上是 EcmaScript 提出来的概念，通过动态 import 在需要的时候才进行加载这就叫做懒加载。

> Webpack 中只是通过动态 import 语句识别懒加载，然后对于动态引入的模块进行 Code Splitting。分割后的 chunk 在一定条件下才会加载。加快了首屏的加载速度。这也就是为什么默认异步 import 引入的模块会被 CodeSplitting 的原因。

##### 代码演示 LazyLoading

```
async function importComponent() {
  // 动态引入lodash
  // webpack默认对于异步代码拆分 会拆分单独打包的lodash在需要的时候才会加载lodash.js
  const { default:_ } = await import("webpackChunkName:'lodash'"lodash)
  const element = document.createElement('div')
  element.innerHTML = _.join(["wang","hao","yu"],"=")
  return element
}
// 当用户点击页面的时候进行懒加载lodash执行逻辑
document.addEventListener('click',() => {
  getComponent().then(ele => {
    document.body.appendChild(ele)
  })
})
```

###### 什么是 chunk

> chunk 其实就是打包后的每一个 JS 文件就可以被称为一个 chunk，回忆一下之前说的 CodeSPlitting 有一个配置条件 minChunks。

> minChunks 意思指的是打包后的 JS 文件，也就是 chunk 引入的次数。而非代码中 import 的次数。

### 打包分析

1. [webpack-analyse](https://github.com/webpack/analyse)

   > 官方提供的工具，打包生成 json 上传 github 地址进行模块分析。

```
You can generate the required JSON file for this tool by running webpack --profile --json > stats.json
```

2. [webpack-chart](https://alexkuz.github.io/webpack-chart/)

   > 同样是通过生成的 stats.json 上传得到一个图标的分析.

3. **[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)**

   > 它是一个插件，打包生成后本地生成的一个打包本地页面提供我们分析。推荐

### Code Coverage

###### 首先关于和 Code Spiltting 页面性能提一下

> 其实对于同步代码的 Code Splitting，大多数情况下都是对于公用第三方库的拆分 chunk。然后达到使用浏览器缓存缓存第三方库，以至于在下次用户访问的时候地方库代码没有变更从而从浏览器缓存读取提升用户体验。

> 但是 webpack 对于性能优化，第一次访问的时候也至关重要。

> 我们可以在 F12 中去展开 code coverage 查看当前页面代码覆盖率，我个人觉得相比较缓存代码覆盖率带给代码的提升是非常巨大的。

> 所以对于 Code Coverage 的覆盖率，应该尽可能的覆盖全：也就是当前页面的 js 尽量只覆盖当前页面的逻辑，其他页面的逻辑当触发一定条件的时候在进行加载。也就是 Lazy Loading 配合 Code Splitting，这样提升 code coverage 对于页面性能优化是巨大的。

> 异步 import 提升代码覆盖率对于性能优化至关重要。

> > 比方说，首页的登陆弹窗。如果我们把登陆弹窗拆分成为一个单独的 module 然后使用动态 import 告诉 weoback 结合 Lazy Loading + Code Splittring 在首页加载的时候并不加载登陆弹窗这部分代码，而是在用户需要弹窗的时候在进行加载。这样的代码方式无疑对于性能提升是非常大的。

**在写高性能前端代码的时候，我个人觉得对于缓存这些提升其实并不是重点考虑的，重点考虑的应该是对于每个页面的代码覆盖率。**

### Prefetch/PreLoad

> 对于刚才讲到的，提升页面性能提高代码覆盖率。使用 Code Splitting 和 Lazy Loading，如果仔细老想的话会存在一个问题:
>
> > 这种按需加载的模式的确提高了代码覆盖率，但是对于用户体验来说当用户需要某个东西的时候才去加载它的 js 脚本，这样对于用户体验不太好会有一定的延迟。
> >
> > > Pretching/Preloading 就是为了解决这个问题。

###### prefetch/preload 功能

> 他们会在页面所需要展示的文件加载完成后，带宽空闲的时候告诉浏览器去加载 LazyLoading 的模块从而不影响页面展示。

> 就比方上边登陆弹窗的例子，如果使用了 prefetc。那么浏览器会在首页加载完毕后（这个时候首页已经展示了）。带宽空闲的时候用户虽然还没有点击登陆（触发条件），浏览器也会自动加载 lazy Loading 的代码以提升用户需要的时候已经提前加载好存在浏览器缓存中了，这样就解决了刚才的问题。(偷偷加载)。

> 注意：当用户点击的时候还是会去加载对应的 js 文件，但是由于 prefetch 已经提前加载过了。所以用户点击的时候是去浏览器加载好放入缓存中去拿的，这样就会比请求快得多。

###### 使用

```
// 魔法注释的形式
import(/* webpackPrefetch: true */ 'LoginModal');
import(/* webpackPreload: true */ 'ChartingLibrary');
```

###### prefech/preload 区别

> prefetch 会等到页面核心代码加载完成之后，页面带宽空闲的时候再去加载对应 prefetchjs 文件

> preload 会再页面核心代码一起加载的。

> 所以在使用 Lazy Loading + code split 的时候配合 prefetch 使用效果最佳。

**接下来就不要在代码中去过分关注缓存了，重点考虑的应该是代码利用率 code coverage。（当然并不是说不需要缓存，只不过 code coverage 应该是非常重要的性能点)**。

### [css 代码分割](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)

- Css 代码分割就是使用 mini-css-extract-plugin 代替 style-loader 进行配置。参考 css-minimizer-webpack-plugin 插件讲述。

  1. 安装 mini-css-extract-plugin。

  2. 替换 style-loader。

  3. 使用 css-minimizer-webpack-plugin 插件。

- Css 代码压缩是使用 optimize-css-assets-webpack-plugin 进行 optimization 配置压缩

  css。参考 optimize-css-assets-webpack-plugin 插件讲述。

  1. 安装 optimize-css-assets-webpack-plugin。

  2. optimization 中的 minimizer 进行使用。

```
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

> 其实让我说，我真觉得 css 分布分割意义不大，现在的网速，已经很快了。除非移动端，你想让页面展示的更快一些，把 css 分离出来，可能会略微有一点点用处。

### Webpack 与浏览器缓存(Caching)

#### output 占位符解决缓存问题。

> 第三方库的代码在我们每次构建之后其实都没有变化，浏览器对于文件名称没有变化的静态资源会优先从缓存中去命中。

> 这就是基于这点，contentHash 解决文件如果没有变更那么 contentHash 的值也就并不会变化。如果文件变更 contentHash 值变化，那么文件名变化浏览器就会重新请求了。

```
output: {
  filename:'[name].[contenthash].js',
  chunkFilename:'[name].[contenthash].js'
}
```

> 新版本的 webpack 已经实现了 contenthash 未改变不改变的功能。

> 对于老版本的 webpack，也就是如果代码没有改变有可能 contenthash 的值也会变化。
>
> > 解决这个问题需要在 optimization 中额外配置。(当然新版本这么配置也没有任何问题)

```
optimization: {
  runtimeChunk: {
    name:'runtime'
  }
  ...
}
```

**这样在未改变原代码的情况下，contenthash 的值就不会变化了。(当然新版本陪它也没有任何问题)**

> 可以看到配置了 runtimeChunk 后每次打包都会生成一个 runtime.xxx.js。

> 在 webpack 中关于第三方的库和业务代码的关系会放在一个 manifest 的文件中，默认 manifest 文件会存在业务代码中也会存在第三方库代码中。(因为它是映射关系文件)。

> manifest 在旧版本的 webpack 中每次打包都会有差异，正是因为这个差异即使在老版本 webpack 中没有改变代码，webpack 打包会认为文件发生变化。

> 当配置 runtimeChunk 配置，就告诉 webpack 抽离 manifest 关系代码为单独文件，业务逻辑和第三方库并不存在 manifest 映射逻辑了。这样的话老版本中代码没有改变 webpack 就不会认为文件改变，contenthash 也就不会改变，可以合理的使用缓存。

> 注意: 抽离的 manifest.js 也会走 output，所以 output 的配置对 manifest 也有效，可以把它认为也是一个 chunk。

### Shimming(垫片)

> Shimming 的概念很宽泛，具体需要我们根据不同的场景去使用就好了。

> 构建一些全局变量以供 src 中代码运行，这就是垫片简单来说的意思。

> 比方一些老的第三方库，并不支持 esmodules 引入的方式，那么我们想再代码中去直接使用就会报错。

```
// jqueryui.js
export function jqueryui () {
  $('body').css('background','red')
}
```

```
// main.js
import { jqueryui } from "./jqueryui.js"
import $ from 'jquery'
jqueryui()
```

> 这时候是一定会报错的，因为 jqueryui 中的\$无法被识别。模块和模块之间的变量是不能被共享的，所以 jqueryui 中无法使用 main 中的变量。
>
> > 这个场景下我们需要 webpack 打包时候识别 jqueryui 的\$，让他知道这是 jqeury 这个库。
> >
> > > 达到的效果是相当于见到$就会自动在当前模块内添加import $ from "jquery'。
> > >
> > > > 这就是垫片 shimming 的作用。
> > > > **可以理解垫片 shimming 的作用就是为所有模块提供一些全局变量以让他们使用。**

1. [webpack. ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/)(提供给各个模块使用)

> 借助 webpack 自身插件 providePlugin 提供全局变量注入供各个 module 使用。

> providePlugin 自动加载，而不必每个模块去 import 和 require。

> 也可以使用 providePlugin 进行使用

```
const webpack = require("webpack")
plugin:[
  ...
  new webpack.ProvidePlugin({
    // 发现使用_的话那么模块就会自动引入lodash
    _:'lodash',
    // 也可以指定完整路径
    identifier: path.resolve(path.join(__dirname, 'src/module1'))，
    // 同时也可以自己定义一些语法提供给各个模块使用 lodash的join方法(数组形式)
    _join:["lodash","join"]
  })
]
```

```
export function ui() {
  $('body').css('background',_join(['blue','']))
}

```

2. [imports-loader](https://webpack.js.org/loaders/imports-loader/#using-configuration)

   > imports-loader 允许我们使用依赖于特定全局变量的模块。

> 使用配置去查文档吧。

```
console.log(this,'this')
console.log(window === this) // false
```

> 通过上边的打印可以看到一个模块的 this，在 webpack 中默认指向的是模块自身。

> 如果强行让 this 指向 window，可以使用 imports-loader。

```
{
                test: /\.js$/,
                exclude: /node_modules/,
                use:['babel-loader',{
                  loader:'imports-loader',
                  options:{
                    imports: 'default lib myName',
                  }
                }]
},

// 相当于
import myName from 'lib';

// ...
// Code
// ...
CommonJS单
```

> imports-loader 也可以充当垫片的作用，和 webpack. ProvidePlugin 可以做相同的事情: 帮助我们在模块中去引入，而不用自己引入。

### Webapck 中的环境变量

> webpack 命令行 环境配置 的 --env 参数，可以允许你传入任意数量的环境变量。而在 webpack.config.js 中可以访问到这些环境变量。例如，--env.production 或 --env. NODE_ENV=local（NODE_ENV 通常约定用于定义环境类型，查看 这里）。

```
// 环境变量 env增加NODE_ENV=LOCAL 同时增加 production属性 默认是true
webpack --env.NODE_ENV=local --env.production --progress

// 注意写法
--env.production // 这种写法是增加production属性
--env production // 而这种写法是直接覆盖env为production
```

```
const path = require('path');

module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
```

#### 同时除了 env 也可以使用直接传递的形式给 modules 接收

```
// package.json srcript 直接传递test为test
"compile": "webpack  --test=test  --env.production --config conwebpack.prod.js --mode production",
```

> 使用 argv 接收 argv 会默认存在一些关于 webpack 打包的信息。
>
> > 直接传递的参数会在 argv 中加入。

```
module.exports = (env, argv) => {
    console.log(env, 'env')
    console.log(argv, 'argv') // 会存在一个key为test的属性，value是test
    return merge(common, prodConfig)
}
```

---

### Library 库文件的打包

> 简单的一些 Library 的打包。

1. Library 地方库第一步需要在 package.jon 中注明库的入口文件。

```
// package.json
"main":"../dist/main.js"
```

2. 接下来就是改变 output 的配置。

- [ libraryTarget and library ](https://webpack.docschina.org/configuration/output/#outputlibrarytarget)

> Library 的意思是打包生成一个全局的变量，libraryTarget 表示这个变量以什么形式挂载。(比如 var 全局变量形式，还是挂载在 this 或者哪些对象属性中)。
>
> > LibraryTarget 如果配置 umd 那么他和 library 关系就不是很大。
> >
> > > libraryTarget:umd 表示支持任何模块引入，但是不支持 script 脚本。再结合 library 以全局变量形式暴露，那么就会同时支持 script 脚本引入了。

1.  'var' | 'assign' : 表示打包后的文件暴露出一个全局变量形式进行引入，配合 output.library 进行引入。(常用与 script 脚本)

2.  this | window | commonjs | global : 通过在对象的属性上暴露，打包后的库文件通过挂载在 this | window ...对象上的属性，属性名为 output.library 配置的名称。

3.  amd | commonjs2 | umd ... : 通过模块引入，常用的是 umd 配置，表示 library 暴露在任何模块下都可以引入的方式。但是 umd 并不支持 srcipt 脚本引入，可以通过 output.library 结合 libraryTarget:umd，让模块支持任意形式引入。

```
  // 打包生成的模块支持amd esModules Commonjs等形式导入
  // 同时也支持script标签引入 引入后通过MyLibrary全局变量注入访问导出的module
    module.exports = {
    //...
    output: {
      library: 'MyLibrary',
      libraryTarget: 'umd'
    }
  };
```

3. [externals 外部扩展](https://webpack.docschina.org/configuration/externals/)

> 防止将某些第三方的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

比如打包一个第三方库中用到了 lodash，但是在打包的时候并不想将 lodash 进行打包进去。希望使用库的用户在项目中结合 lodash 一起使用，那么就可以在 library 打包中使用 externals 排除 lodash 避免重复打包。

> 具有外部依赖(external dependency)的 bundle 可以在各种模块上下文(module context)中使用，例如 CommonJS, AMD, 全局变量和 ES2015 模块。外部 library 可能是以下任何一种形式：

- root：可以通过一个全局变量访问 library（例如，通过 script 标签）。
- commonjs：可以将 library 作为一个 CommonJS 模块访问。
- commonjs2：和上面的类似，但导出的是 module.exports.default.
- amd：类似于 commonjs，但使用 AMD 模块系统。

```
  // webpack.config.js

  // 数组形式

  // 告诉webpack打包过程中遇到lodash就忽略它不进行打包lodash
  externals:["lodash"]

  // 对象形式

  externals:{
    lodash: {
       // 如果我们的第三库在commonjs环境下运行 (require引入)
      // 要求lodash必须是名为lodash (const lodash = require('lodash'))
      commonjs:"lodash",

      // root表示全局script标签引入的时候
      // 要求lodash定义在全局变量_下
      root:"_"
    }
  }
```

> 一般来说在没有特殊要求 ��� 时候使用数组形式就可以了，就比方上边的形式他的意思就是说任何情况下引入的 lodash 都要命名为 lodash。
>
> > 至于到底怎么要求命名需要结合我们库文件是怎么使用的，比如我们库中如果将 lodash 定义为了*去使用。那么我们肯定是需要 lodash 命名为*。

> 当然这只是简单的说库的打包，真正库的打包一些 TreeShaking，按需加载等等之类。以后慢慢进行完善。

基本三步配置:package.json 修改入口文件 --> output 配置 library/libraryTarget --> 配置 externals 忽略依赖包

---

### PWA 应用打包配置

> 使用到在进行总结。。

---

### TypeScript 应用打包配置

> 19-Fetch 发布后总结。

---

### WebpackDevServer 开发环境下实现请求转发

> 主要是针对 devServer 的 proxy 配置的讲解。devServer 依赖 http-proxy-middleware 底层搭建，可以查看[doc](https://github.com/chimurai/http-proxy-middleware#options)进行详细查阅。

#### Proxy 配置项

1. 字符串形式，表示进行匹配路径转发.

```
    proxy: {
      // 表示以react-api的请求路径代理到http://www.dell-lee.com
      // react-api/test -> http://www.dell-lee.com/react-api/test
      'react-api':'http://www.dell-lee.com'
    }
```

2. pathRewrite:路径重写。

> 比如一个场景，真实 header.json 接口还没通。后台仅仅提供一份假数据 demo.json，这时候就可以使用 pathRewrite 进行路径重写调试。
>
> > 当 header.json 通了后注释掉对应 pathRewrite 就可以调试了。并不需要修改源代码。

```
    proxy:{
      '/react-api': {
        // target代表代理的服务器
        target:'http://www.dell-lee.com/react-api',
        pathRewrite:{
          // 如果是请求的是header.json那么就重写为demo.json
          'header.json':'demo.json'
        }
      }
    }
```

3. secure:默认情况下，devServer 将不接受在 HTTPS 上运行且证书无效的后端服务器。配置 secure 为 false 可以解决 https 的代理。

```
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false
      }
    }
  }
```

4. bypass:进行代理拦截，return false 表示跳过转发不走代理。或者控制转发内容。

```
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
```

5. 数组形式，多路径代理。

```
  devServer: {
    proxy: [{
      // 访问/auth或者/api都会代理到http://localhost:3000
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }]
  }
```

6. index:默认 devServer 并不会代理根目录的请求(所有),需要支持的话需要将 index 的配置为空字符串或者 false 才会生效。

```
  module.exports = {
  //...
  devServer: {
    index:"",
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
  };
```

7. changeOrigin:有一些网站对于 origin 做了限制，防止外部爬虫进行爬数据限制了 origin。配置 changeOrigin 为 true 会解决对于 origin 做的限制。

> 没有特殊要求的话，做代理转发的时候始终配置为 true。

```
    module.exports = {
      //...
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true
          }
        }
      }
    };
```

> 当然需要注意的是 devServer 仅仅对于开发环境有效，线上它并不会生效。
>
> > 以及 Devserver 底层使用的 evServer 依赖 http-proxy-middleware 底层搭建，可以查看[doc](https://github.com/chimurai/http-proxy-middleware#options)进行详细更多配置查阅。比如:

1. headers:自定义请求头。

2. timeout...很多配置。

```
  proxy:{
      '/react-api': {
        // target代表代理的服务器
        target:'http://www.dell-lee.com/react-api',
        pathRewrite:{
          // 如果是请求的是header.json那么就重写为demo.json
          'header.json':'demo.json'
        },
        // mock headers
        headers:{
            host:'https://wangHaoyu.com',
            cookie:"mockCookie"
        }
      }
    }
```

### WebpackDevServer 解决单页面路由问题

关于 H5 路由和 Hash 路由的区别以及在 Vue 和 React 中对于这两种路由的区别详细参见[路由详解](https://github.com/19Qingfeng/Router-way)。

当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容。 将 devServer.historyApiFallback 设为 true 开启：

```
module.exports = {
  //...
  devServer: {
    historyApiFallback: true
  }
};
```

> 这样配置的话对于 H5 路由的配置就可以生效了。
>
> > 它的意思是说对于所有请求路径请求都会返回 index.html(跟路径)的资源。当返回 index.html 的资源的时候，我们打包的 js 代码会对 url 进行解析然后根据 url 处理前端路由。

还可以更加详细的使用 rewrites 配置进行精准匹配

```
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
```

当然 historyApiFallback 也会使用很多配置,可以参考[Doc](https://github.com/bripkens/connect-history-api-fallback)进行配置。

> 大多数开发场景下我们使用 true 的配置就可以了，如果有一些额外的配置去查文档进行配置就可以了。

> 当然这是对于开发环境 devServer 的配置，线上环境的话同样需要后台同事在 nginx 或者其他服务器上进行重定向的配置。(和 historyApiFallback 配置一样就可以)
>
> > 配置后台服务器对于访问不到的资源路径强行返回跟路径或者指定路径处理。

### Eslint 在 webpack 中的配置

1. 项目中安装 ESlint

```
npm install eslint --save-dev
```

2. 初始化项目 eslint:

```
npx eslint --init
```

- 三种方式去选择。

3. 配置 eslint
   > 虽然 init 之后 eslint 已经开始使用了，但是这还不够好用。

我们在进行配置 parser(解析器)，eslint 默认使用 Esprima 这个解析器，可以配置成 Babel-EsLint 解析，业界比较常用的。

```
npm install Babel-EsLint
```

```
// eslint配置文件
modules.exports = {
  "extends":"airbnb",
  "parser":"babel-eslint"
}
```

4. ESlint 检查代码的配置

-  命令行使用 eslint 检查代码

```
npx eslint src // 使用eslint检测src下的代码
```

- 配置 IDE 插件进行实时对于代码检查(推荐)

IDE 中安装 Eslint 插件就可以了。

5. Eslint 配置项目-自定义规则

虽然我们初始化的时候使用了 airben 的 extends 扩展规范。但是我们仍然想自己定义一些 eslint 的规则。可以在 eslint 配置文件使用 rule 配置对应的 eslint 配置。

- rules
  > tips:如果想要忽略一些过于严格的规范，IDE 会提示错误的地方是哪些 ESlint 的 rule。这时候复制这个提示的 rule 然后在配置文件中 rule 配置为 0 就表示忽略该规则，eslint 就不会报错了。。

```
// eslint配置文件
modules.exports = {
  "extends":"airbnb",
  "parser":"babel-eslint",
  "rules":{
    “react-prefer-stateless-functuin”:0
  }
}
``
```

- global
  对于一些全局变量在页面中直接引入的忽略报错规则可以配置 global 配置。
  > 配置 document:false 表示本身 document 变量不允许被覆盖，我们就可以在页面使用全局变量 document。

```
modules.exports = {
  "extends":"airbnb",
  "parser":"babel-eslint",
  "global":{
    document:false
  },
  "rules":{
    “react-prefer-stateless-functuin”:0
  }
}
```

#### ESlint-loader 解决不同 IDE 下规范代码

当一些 IDE 并没有安装 ESlint 但是又为了团队统一规范的时候，可以使用 eslint-loader 配合 devServer 进行规范。

```
npm install eslint-loader
```

```
{
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader"
                },"eslint-loader"]
            },

... // devServer配置
devServer:{
  overlazy:true, // 全屏覆盖错误
}
```

###### 当然 ESlint-loader 还有许多配置

比如 fix 是否自动修复，cache 缓存检查提高构建速度，force:'pre'强制 ESlint 优先执行(eslint-loader 的位置就可以放在 babel-loader 之前他都会强制 eslint-loader 优先处理 js 代码)等等

> 大多数场景下会配合 git 提交前进行处理 eslint 规范，这个仁者见仁智者见智了。

### Webpack 性能优化

1. 升级 Node 和 Webpack 进行文件打包处理。

2. 在尽可能少的模块上应用 loader。

比如 babel-loader 的 exclude:/node_modules/，完全没有意义增加了构建的时间,loader 的范围越少意味着无谓的代码处理会更少速度也就更快。

3. plugin 尽可能精简并且确保准确性。

减少不必要的 plugin 节约了打包速度，比如 dev 环境下的 css 压缩以及 splitchunk 等。

4. resolve 合理使用。

- 合理配置 resolve's extensions 配置，配置很多 extensions 的时候 webpack 在打包的时候会多次的调用 nodejs 中的 fs 文件查找会存在打包性能损耗降低构建速度。

- 合理配置 resolve's mainFiles 配置，查找文件夹内文件规则。

* 合理使用 resolve's alias。

> 以上三点针对构建速度。

5. 提取公共包单独打包。(动态连接库)

> 达到的效果是:针对项目一些 lodash，vue，react 等等公用类库。每次打包其实没有必要重新打包一次没有变化的类库，我们达到针对公用类库打包一次然后在 html 中引入。之后在代码打包过程中就会引入之前打包好的第三方类库文件。节省了打包的速度。

Tips:<br>

dllPlugin 仅仅在开发环境使用有效，在 production 是无效的。而且其实在 webpack5 中已经实现了对于打包文件的缓存，所以不需要这个东西了说实话。

1. 建立 webpack.dll.js，entry 抽离第三方库打包。

2. webpack.dll.js 中 library 挂载全局变量形式。(挂载 js 文件后页面就会存在对应的全局变量)

3. webpack.dll.js 配置 webpack.DllPlugin 针对 output 生成的 js 文件同时生成一份 mainfest.json 映射文件。这份映射文件使用 dllReferencePlugin 去分析。

   > dllReferencePlugin 引入对应的 mainfest.json，webpack 在下次打包的时候就会根据映射文件对于已经打包引入的第三方库去生成的 js 中去直接拿。

4. webpack.dev.js 配置 webpack.DllReferencePlugin 结合全局 dll 暴露的全局变量和 mainfest.json 分析对应模块是否存在。

5. webpack.dev.js 配置 AddAssetHtmlWebpackPlugin 将生成的 js 文件挂载在 html 页面中。

> 注意 DllPlugin 的 name 和 output 中 library 的 name 保持一致性。

- 抽离第三方模块单独 config 打包(不要忘记 output 挂载 library) ->

- 配合使用 webpack.dllplugin 生成 manifest.json ->

- -> AddAssetHTMLWebpackPlugin 将生成的公共 js 文件注入到打包生成的 html 中

- -> 配置文件中使用 webpack.DllreferencePlugin 引入 manifest.json 查找对应映射。

> 关于抽离第三方公用组件库其实我个人看法在开发环境下使用这钟方式提升开发效率而在线上环境仍然需要一次一次的 build。

> 以及在 Webpack5 中其实已经存在了打包的缓存机制，所以也就没有必要抽离第三方公用插件了。

6. 控制包的大小

通过 TreeShaking，SplitChunks 减少包体积的大小。

7. 多进程打包

thread-loader,parall-webpack,happypack 利用 nodejs 多进程进行多个进程打包。

8. 合理使用 sourceMap

不同的 sourceMap 对于包体积和构建速度是不同的，官网有表格详细对比。
所以合理使用 sourceMap 选择合适的错误映射方式同时又提高性能也很重要。

9. 结合 stats 分析打包结果

之间讲到的做打包分析～

10. 开发环境删除无用的插件！

---

## 至此，开始深入 webpack 进行讲解

### 编写一个 loader

> [loaderApi。](https://www.webpackjs.com/api/loaders/)

实际上 loader 非常简单，他就是一个函数。

编写一个 loader 其实非常简单，就是使用一段 js 脚本处理传入的源文件然后引入进行处理就 OK。

需要注意：

1. loader 声明不可以使用箭头函数，使用箭头函数 webpack 无法找到 this。

2. loader 接收的参数 source 就是源代码,然后 return 处理后的 source 就可以了。

3. 使用 loader 的使用可以通过 option 传递参数，loader 内通过 this.query 接收参数。(使用 loader-utils 可以更加方便分析参数)。

- loader-utils/this.query 接收参数

```
const loaderUtils = require("loader-utils")
const loaderUtils = require("loader-utils")
module.exports = function(source) {
    // 两种形式都是获得options传递的参数
    const options = loaderUtils.getOptions(this) // options.name
    const name = this.query.name;
    return source.replace("wanghaoyu", name)
}
```

> 当然在新版本中 query 已经是废弃字段，使用 options 替代了。但是我包的 webpack 仍然是使用的 query 接收。详细可以查看官网 api 查阅。

- this.callback()替代 return。

> 有时我们想再 loader 处理完成之后不仅仅返回一份源代码，比如返回一些错误返回一些 sourceMap 映射信息等等就可以不使用 return 从而使用 this.callback。

```
this.callback(
  err: Error | null, // 错误信息 没有填null
  content: string | Buffer, // 返回代码内容
  sourceMap?: SourceMap, // 返回sourcemap
  meta?: any // 其他meta信息
);
```

- this.async()

告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback。
在异步操作调用 async 返回的 callback 就会返回。

- Tip:

如果项目中存在很多自定义 loader，当我们使用他们的时候会出现丑陋的代码:

```
{
                        loader: path.resolve(__dirname, "../mkloader/replaceLoader.js"),
                        // 传递参数 loader中使用this.query.name接收
                        options: {
                            name: "wanghaoyushijushenne!"
                        }
},
...
```

实际上我想像比的 loader 使用的那样，使用一个名称 webpack 就会去 node_modules 中去找。

达到要让 webpack 去我们的目录去找 loader 的话，需要进行配置 resolveLoaders

- resolveLoaders

  - modules 配置，寻找 loader 时候去查找的路径规则。

  ```
  resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "../mkloader")]
  },
  ```

- [编写 loader 存在很多 API...](https://www.webpackjs.com/api/loaders/)

- 关于自定义 loader 的使用场景

> 代码异常捕获，以前需要修改源码去 try catch。现在就可以使用 loader，去分析 function 做去 try catch。

> 国际化，将变量使用占位符，使用自定义 loader 进行替换中文 or 其他语言标题。根据不同环境打包不同的语言。

总之，对于一些源代码的包装我们可以自定义 loader 进行实现。

### 编写 Plugin

关于 loader，更多的是帮助我们处理模块。比如引用一些非 js 文件。

Plugin 帮助我们在打包的一些时刻生效。

loader 的编写非常简单，就是接收源代码和返回处理后的源代码。但是 plugin 会比较麻烦了，**Plugin 的核心机制就是发布订阅者模式，也就是事件驱动模式**,通常 plugin 会使用 class 去编写。

- 首先，自己编写 plugin 它是一个 class 通过 new 调用。存在 construcot 和 apply 实例方法。

- 插件传递的参数，在 constructor 中使用 options 接收参数。

```
plugin: [
  ...
  new CopyRightWebpackPlugin({
    name:"10-Qingfeng",
    company:"hylink"
  })
]


class CopyRightWebpackPlugin {
    constructor(options) {
      console.log(options) // 接收参数
        console.log("插件被使用了")
    }
    apply(compile) {}
}
```

- apply 方法接收一个 compile 参数，这个参数可以理解为 webpack 的实例。这个参数存储了各种个样比如 webpack 配置文件，打包过程等等

注意 apply 方法的 compile 具有很多[hooks](https://webpack.js.org/api/compiler-hooks/)钩子。

需要注意的是使用这些钩子函数要区分同步或者异步去调用

同步，比如 compile 同步 hook（beforeCompile 在创建新编译之前，在之后立即调用）。
同步使用 tap 方法，接收一个插件名称参数和一个 callback 参数，callback 存在 compile 参数。

```
// compile是关于打包编译的信息
apply(compile) {
  // 第一个参数为插件名称，第二个为一个callback
  compile.hooks.compile.tap("CopyRightWebpackPlugin",(compliation) => {
    // compliation是具有关于本次编译的相关信息
    // 打包生成的文件存放在assets中
    // 我们为他增加一个myText我们自己定义的文本
    compliation.assets["myText.txt"] = {
      // source 返回的是文件存放内容
      source: function() {
        return "19-QingfengWebpack"
      },
      size: function () {
        // size返回文件大小
        return 18
      }
    }
  })
}
```

异步，比如 emit 钩子，将生成的文件输出在目录之前的执行。
异步使用 tapAsync 方法，接收一个插件名称参数，接收一个 callback 参数。callback 接收两个参数。一个是 compliation 第二个是 cb，显示调用 cb 表示完成

```
apply(compile) {
  compile.hooks.emit.tapAsync("CopyRightWebpackPlugin",(compliation,cb) => {
    // 显式调用cb 声明异步钩子hook结束
    ...
    cb()
  })
}
```

- plugin 的执行时刻（也就是 webpack 打包生命周期），就是通过 compile 参数的 hooks 属性去配置的。

关于 complie 部分的 hooks 属性可以去[官网 DOC 查询](https://webpack.js.org/api/compiler-hooks/)。

关于 compliation 中的属性，比如 compliaton.assets 是生成的文件对象。。可以使用 nodejs 调试工具去调试 debugger：

```
// package.json中添加
// 显式声明运行webpack打包 同时使用参数 --inspect开启nodejs调试 --inspect-brk表示在第一行打一个断点
// 然后就可以在控制台F12中进行调试了，之后配合我们在plugin中定义的debugger，查看对应对象下的各个属性参数
scripts: {
  ...
  debugger:"node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"
}
```

> 具体参考 mkdir/copyright-webpack-plugin 把。

---

### Bundle 编写

> 编写一个类似 webpack 的小型打包工具。

[19-bundle](https://github.com/19Qingfeng/19-Bundle)

简单小型打包工具。
