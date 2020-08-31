const {
    merge
} = require("webpack-merge")
const common = require("./webpack.common")

const prodConfig = {}

module.exports = (env, argv) => {
    return merge(common, prodConfig)
}