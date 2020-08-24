const path = require('path')
const { merge } = require("webpack-merge")
const common = require("./webpack.common")
const devConfig = {
    devtool: "cheap-module-eval-source-map",
    devServer: {
        index: "wanghaoyu.html",
        open: true,
        contentBase: path.resolve(__dirname, "../dist"),
        port: 9000,
        hot: true,
        // 如果hot没有起作用 配置hotonly:true，hot不生效也也不会刷新页面
        hotOnly: true
    },
    // 配置dev的Tree Shaking 进行测试
    optimization: {
        usedExports: true
    }
}
module.exports = merge(common, devConfig)