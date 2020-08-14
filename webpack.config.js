const path = require('path')

module.exports = {
    mode:"development",
    entry: {
        main: path.resolve(__dirname, "./src/main.js")
    },
    output: {
        filename: "bundle.js",
        // 相对于当前(webpack.config.js)的dist文件夹下
        path: path.resolve(__dirname, "dist/")
    }
}