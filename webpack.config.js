const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "./src/main.js")
    },
    // 配置loader
    module: {
        rules: [{
            test: /\.jpe?g$/, // 匹配对应文件
            use: {
                // 对于匹配到的文件使用的处理loader
                loader: "file-loader"
            }
        }]
    },
    output: {
        filename: "bundle.js",
        // 相对于当前(webpack.config.js)的dist文件夹下
        path: path.resolve(__dirname, "dist/")
    }
}