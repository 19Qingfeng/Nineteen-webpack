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