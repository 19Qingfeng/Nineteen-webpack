const path = require('path')
const {
    merge
} = require("webpack-merge")
const common = require("./webpack.common")


const WebpackDevMiddleware = require('webpack-dev-middleware');



const devConfig = {
    devtool: "cheap-module-eval-source-map",
    devServer: {
        index: "wanghaoyu.html",
        // open: true,
        contentBase: path.resolve(__dirname, "../dist"),
        port: 9000,
        hot: true,
        // 如果hot没有起作用 配置hotonly:true，hot不生效也也不会刷新页面
        hotOnly: true
    },
    // 配置dev的Tree Shaking 进行测试
    optimization: {
        usedExports: true
    },
    output: {
        filename: "[name].js",
        // publicPath: "/",
        // 相对于当前(webpack.config.js)的dist文件夹下
        chunkFilename: "[name].chunk.js",
        path: path.resolve(__dirname, "../dist/")
    }
}
module.exports = merge(common, devConfig)