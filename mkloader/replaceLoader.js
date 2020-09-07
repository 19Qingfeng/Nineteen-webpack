/* 
// 最简单的loader
module.exports = function(source) {
    return source.replace("wanghaoyu", "wanghaoyushijushen")
} 
*/

/* const loaderUtils = require("loader-utils")
module.exports = function(source) {
    const options = loaderUtils.getOptions(this)
    console.log(options, 'options')
    console.log(this.query, 'query')
    const name = this.query.name;
    return source.replace("wanghaoyu", name)
} */


// this.callback

/* const loaderUtils = require("loader-utils")
module.exports = function(source) {
    const options = loaderUtils.getOptions(this)
    console.log(options, 'options')
    console.log(this.query, 'query')
    const name = this.query.name;
    const content = source.replace("wanghaoyu", `test-${name}`)
    this.callback(null, content)
} */

// 异步loader
const loaderUtils = require("loader-utils")
module.exports = function(source) {
    const options = loaderUtils.getOptions(this)
    const name = options.name;
    const cb = this.async()
    const content = source.replace("wanghaoyu", `test-${name}`)
    setTimeout(() => {
        cb(null, content)
    }, 0)
}