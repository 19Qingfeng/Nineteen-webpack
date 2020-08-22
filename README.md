# 19-webpack
重新温习温习webpack。<br>
每次commit配对对应Demo，webpack4.X常用配置以及性能优化。


### 什么是loader？
> webpack默认知道如何打包js文件，对于一些css，图片，字体等非js文件需要使用使用loader去处理让webpack识别通过loader处理。
<br>

File-loader举例 -> 当webpack碰到test匹配的.jpeg结尾的文件就会交给use的file-loader处理。<br>

+ 首先遇到test-img.jpeg会将它移动到dist目录下，同时会修改名称。(文件移动到打包目录下)
+ 然后得到一个图片相对与dist目录的一个名称然后讲名称返回给require的变量default属性中。(同时获得移动文件的地址)

> 其实loader就是一个特定方案，让webapck对一些不支持的文件通过loader认识他们并且进行打包。<br>
> webpack对于非js文件通过loader进行识别。<br>
> module中的rules进行配置。


#### 使用loader打包静态资源(图片)
+ 处理图片资源File-loader和Url-loader。
+ url-loader和file-loader配置和相似，url-loader会将配置小于limit(单位为btye 1024 -> 1Kb)会转化为base64。

#### 使用loader处理样式文件

1. 使用loader处理样式文件(1)

+ loader的处理是从右往左（从上往下），当一个文件需要被多个loader处理的时候。
+ 处理Css文件通常需要两个loader，css-loader和style-loder。
+ 先使用css文件处理，如果有多个css文件互相引入，css-loader会先进行处理->分析出css文件之间的关系，最终将css文件合并成为一个css文件。
+ css-loader处理完毕后，style-loader会将生成的一个css文件挂载在html页面的head标签的style样式上。
+ 如果要使用less，scss等预处理器，那么在碰到less等后缀文件的时候，需要额外引入对应loader进行处对应文件。
+ sass-loader(将less语法编译成css语法) -> css-loader(处理css文件关系生成css文件) -> style-loader(加入页面head标签)
+ sass-loader(npm install sass-loader node-sass -D)
+ 针对一些Css属性的前缀，C3不同厂商的前缀自动添加，可以使用postcss-loader中的aotoprefexer插件自动添加。
+ postcss-loader(处理前缀autoprefixer插件) > sass-loader > css-loader > style-loader
+ postcss.config.js进行配置文件设置。[postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

> Tips: <br>

> 打包默认认为在高级浏览器中使用这些特性，高级浏览器已经没必要加这些前缀了。所以就算配置了autoprefixer也不会添加，package中browserList里面加上老版本浏览器的兼容才会进行添加。
> 关于browserList，可以在Can I usr 查。

2. 使用lodaer处理样式文件(2)
+ CSsloader常用配置项。
    1. import-loaders:(Number),当使用css文件的时候。如果存在样式文件内引入样式文件也就是在样式文件中import在引入其他样式。webpack在打包的时候就不会去走到css-loader之前的loader处理了。这个时候importLoaders配置的number，就会保证在样式文件在在引入其他的样式文件，那么也会完整执行样式文件的loader顺序。
    2. modules:true.开启CSs模块化，使用过react的朋友应该有感受。如果在webpack中直接引入样式文件那么会是全局的引入样式文件。开启cssloader的modules配置的话那么就会使样式文件模块化。
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

> 关于CssModules的配置，如果开启了cssModuels那么匹配到的文件都会是模块化的，无论何种方式引入都不会是全局生效。业界目前主流解决方案是自定义文件后缀或者增加文件名称。<br>
> 比如React中以xxx.modules.css结尾的文件认为是modules局部样式，普通xxx.css是全局样式。要达成这样的效果需要配置两个loader的rules，比如
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

#### 使用loader处理字体文件
+ file-loader帮助webapck识别ttf,eot,woff等格式的字体文件处理。
+ file-loader配置和url-loader类似，其实fileloader也可以处理图片文件，只不过url-loader存在limit配置可以转成base64.

### Plugin

> Plugin本质上就是在webpack运行到某个时刻的时候，帮我们做一些事情，类似生命周期函数。

#### [HTML-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)
> HTML-webpack-plugin会在打包结束后，自动生成一个html文件，并把打包生成的js文件插入到html文件中。
+ 常用配置信息
    1. title:用于生成Html的标题。（配合ejs或各框架使用- <%= htmlWebpackPlugin.options.title %>）
    2. filename:生成的名称，默认index.html。 
    3. template:指定路径，用于生成html文件时的模板文件。
    4. inject :true | ‘head’ | ‘body’ | false 。把所有产出文件注入到给定的 template 或templateContent。当传入 true或者 ‘body’时所有javascript资源将被放置在body元素的底部，“head”则会放在head元素内。
    5. favicon : 给定的图标路径，可将其添加到输出html中。
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
+ 常用配置
    1. dry:默认false，删除mock文件。
    2. verbose:打印信息。
    ...
> 之前配置更新了。。用到的还是查文档吧。。更新太快了。

### Entry和Output的基础配置


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
> sourceMap作用：它是一个映射关系，如果代码有报错，通过sourceMap可以将打包后代码出错的地方映射到源码中出错的地方。

> 经过映射的转化我们也就可以快速精准的定位问题。

#### devtool (sourceMap配置属性)

###### [devtool配置属性和对应构建速度](url)

> Tips:

+ 配置sourceMap后打包后的代码会对应出现map.js文件，她其实就是存放映射关系的(非inline)。

+ inline:如果添加一个inline，就会将打包生成的js文件和.map合并。map文件变成base64文件放在打包后js文件底部。

+ cheap：（增加构建速度）
    1. 只提示多少行出错并不提示多少列出错 
    2. 只负责业务代码的错误，第三方插件错误并不会提示（比如loader的错误并不会提示）

+ module:cheap中存在module，就是表示cheap打包后的代码，提示错误不仅会管理业务代码还会管理第三方模块的错误。

+ eval:通过eval方式进行代码打包，eval执行形式进行打包映射对应错误。（并不会生成.map，构建速度最快的方式）。

###### sourceMap配置建议。

+ development建议:建议使用cheap-module-eval-source-map 这种方式 提示比较全同时打包速度比较快的。
+ production建议：绝大多数不需要sourceMap配置，如果出现问题可以配置cheap-module-source-map线上代码有问题也可以定位错误。

### DevServer
> 每次都需要打包后打开html进行查看，devserve帮助我们在本地启动一个node环境解决这个问题。

1. webpack's Watch Mode 
```
// package.json:
scripts: {
    "watch":"webpack --watch"
} 
```
> --watch这个参数，监控到webpack所需要打包的代码发生改变。会自动执行打包代码，但是他并不会帮助我们起一个服务器。就意味着打包生成的文件是在本地访问。没有办法去做一些ajax的请求调试，而且每次打包过后都需自己手动刷新浏览器。
2. webpack-dev-server（推荐）

> webapck内部已经内置了devServer的配置，但是注意我们还是需要安装webpack-dev-server这个插件。

+ index：默认识别html文件名为index.html，如果生成HTML的文件名非index，则需要在index配置中改成对应的才可以正确启动。
> HTML template is required to serve the bundle, usually it is an index.html file. Make sure that script references are added into HTML, webpack-dev-server doesn't inject them automatically.

+ contextBase:指定静态资源的根目录的，意思就是不受webpack控制的资源文件。读取的路径，比方在没有设置htmlwebpackplugin的时候，devserver会根据contentbase的目录去查找到对应html文件从而打开。但是一旦使用了htmlwebpackplugin，contentbase就会没有效果。htmlwebapckplugin生成的文件devserver会直接打开而忽略contentbase配置。
> contentBase，首先devserver需要依赖一个html文件去进行打开我们的网页然后实现启动服务监听，所以contentBase指向的路径就是devServer所依赖的html文件所在的路径，这个html文件名字默认去寻找index.html文件.如果我们需要依赖其他html文件那么就需要配置filename。

> 其实devSever实质上也是在我们修改代码的时候自动帮我们构建代码然后实现更新，所以devServer打包后的资源（比如js文件）就会放在contentBase下的目录中。可以这样讲，devServer需要依赖contentBase指向的html文件，同时他也会将打包后的文件存在放contentBase目录中去（虚拟目录看不到）。

> 注意，如果项目中配置了html-webpack-plugin的话那么contentBase我的实践中会无效，她不会去根据配置路径去寻找html文件而是会启动html-wepback-plugin生成的html文件，即使conetentBase路径和生成的html路径不一致。会以html-webpack-plugin路径为准。

> 官网给出的解释是：告诉devServer寻找静态资源的路径，只有在需要提供静态资源的时候才会这么做（比如html文件）。

> contentBase可以传递一个String代表生成静态资源路径和生成静态资源存放路径，也可以传递一个Array[String],表示在多个文件中dev服务可以去寻找静态资源。

> 关于contentBase的确也踩了坑，谨记一句话：告诉devServer生成的静态资源比如打包后的js文件存放的目录以及同时告诉devServer启动服务依赖的静态资源在哪里（比如需要依赖的html文件）。但是在配置后html-webpack-plugin失去效果。（所以平常项目中如果使用html-webpack-plugin就无需配置contentBase）。

+ open
+ port
+ proxy:如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
```
 proxy:  {
     // /api开头的请求转发到3000下
     // /api/test -> http://localhost:3000/api/test
     "/api": "http://localhost:3000"
 }

```
+ publicPath
+ historyApiFallback
> 说到historyApiFallback一定要介绍两种路由跳转方式。
关于Hash和History路由区别和原理可以参考我的另一篇文章有详细介绍区别[router模式区别和实现原理](https://github.com/19Qingfeng/Router-way)

> HistoryApiFallback针对于H5 History路由进行设置的，就比如vue-router中的history模式。比如我们访问localhost:8080/list这个页面，devserver会直接去寻找/list的资源但是这个时候并不存在这个资源这是我们前端路由设置的。所以可以使用HistoryApicallback设置访问不到重定向当主页然后代码就会根据url识别前端匹配到前端自己的路由。
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
> 扩展一下。自己搭建一个nodeServer,使用webpack-dev-middleware和express。
```
script: {
    "middleware":"node server.js"
}

npm install express  webpack-dev-middlerware -D
// 其他配置参考本次commit
```
### Hot Module Replacement
> 关于HMR做到的功能我就不在累赘了，热重载现在cli项目全都在使用。

> 讲讲之前版本的hotModuleReplacement。
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
> 但是现在新版本的webpack中已经自己集成了hotModuleReplacement插件了。我们如果需要热更新需要的配置仅仅是在devServer中hot:true就可以了。
+ devServer热冲载配置项目。
    1. hot:true 开启热重启功能。
    2. hotOnly:true 表示即便HRM的功能没有刷新，配置true浏览器也不会自动刷新。
---
> 稍微说点关于HRM的实际实现。
>> 参考本次（HRM）commit的代码，我们可以发现对于js文件不同模块的的HRM需要我们使用HRM的accept语法去做判断独立更新各自的模块。比如:
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
>> 每次当我点击页面很多次，也就是count值变化之后。我再去代码中修改number的值因为HRM的缘故count值就会跟随刷新而重制，这显然不是我所需要的样子。
>>> 我需要的是每次在代码中独立更新number的值的时候count的内容并不会被HRM刷新改变。换句话说也就是希望页面每个模块之间独立被HRM进行更新。
+ module.hot.accept(name,cb)
    1. name表示传入的模块路径，比如import的js文件模块。
    2. name模块发生变化的时候，就会执行cb函数。
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
+ 也就是说我们可以通过module.hot.accept这个方法覆盖每个模块文件的HRM的默认热更新形式从而达到不去影响别的逻辑（交给我们自己处理），比如上边的代码就覆盖了number.js改变的时候HRM帮我们执行的逻辑。这样就不会对于每次改变都会刷新整个页面逻辑了。
+ 默认不配置module.hot.accept的时候每次改变任意文件它就会帮助我们刷新整个页面。
###### 关于module.hot.accept的实现
+ 其实我们在修改css文件的时候发现css也是独立模块互不影响的，并不像js文件这样全局刷新。引入CSS文件的改变理论上我们也应该通过accept方法进行监听修改逻辑，这是因为module.hot.accept这些逻辑在css-loader上底层已经帮我们进行了实现，我们使用css-loader的时候就不需要额外实现这段代码了。
+ 在Vue中我们在书写代码的时候也是模块之间互不影响的，同理其实是vue-loader底层帮我们实现了module.hot.accept的逻辑。
+ React中借助了一些babel-prest内置了module.hot.accept各个模块之间的实现。
+ 通常项目中我们是不需要额外书写HRM的accept监听逻辑的，但是如果我们在代码中引入了一些比较偏的文件，比如一些数据文件。这些文件的loader中并没有实现accept()的逻辑，这时候就需要我们实现了。
+ 本质上HRM都需要实现accept()方法实现独立更新，但是一些第三方插件已经帮我们实现了。这里的话还是需要给大家说一下，有时候一些文件没有实现那么就需要我们去自己实现了。
+ HRM提供的方法不仅仅是accept()还有很多，比如decline()等等，具体使用的时候可以去文档查询。[module-api](https://webpack.js.org/api/hot-module-replacement/#module-api)
+ [HRM实现原理](https://www.webpackjs.com/concepts/hot-module-replacement/)
+ 问题待解决:accept中如果代码出错，控制台并不报错。why？



