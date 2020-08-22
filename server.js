const express = require("express")
    // 在node中使用webpack
const webpack = require("webpack")
const webpackDevMiddler = require("webpack-dev-middleware")
const config = require("./webpack.config.js")
    // 编译器
const compile = webpack(config)
const app = express()

// 文件发生改变webpack就会重新运行
// 重新运行编译打包 设置publicPath
app.use(webpackDevMiddler(
    compile, {
        publicPath: config.output.publicPath
    }
))
app.listen(3000, () => {
    console.log("server running 3000..")
})