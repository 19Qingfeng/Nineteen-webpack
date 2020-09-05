const path = require("path")
const webpack = require("webpack")
module.exports = {
    entry: {
        vendors: ["lodash"]

    },
    plugins: [
        new webpack.DllPlugin({
            name: "[name]",
            path: path.resolve(__dirname, "../dll/[name].mainfest.json")
        })
    ],
    output: {
        path: path.resolve(__dirname, "../dll/"),
        filename: "[name].dll.js",
        library: "[name]"
    }
}