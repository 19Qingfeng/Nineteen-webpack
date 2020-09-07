// 我们编写一简单的plugin 希望在打包结束后dist目录下生成一个版权文件。

class CopyRightWebpackPlugin {
    constructor(options) {
        console.log(options, 'options')
        console.log("插件被使用了")
    }
    apply(compile) {
        compile.hooks.emit.tapAsync("CopyRightWebpackPlugin", (compliation, cb) => {
            compliation.assets["copyRight.txt"] = {
                source: function() {
                    return "copyRight-19Qingfeng.txt"
                },
                size: function() {
                    return 25
                }

            }
            cb()
        })
    }
}

module.exports = CopyRightWebpackPlugin