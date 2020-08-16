const path = require('path')

module.exports = {
    mode: "production",
    entry: {
        main: path.resolve(__dirname, "./src/main.js")
    },
    // 配置loader
    module: {
        rules: [{
                test: /\.(jpe?g|png|gif)$/, // 匹配对应文件
                use: {
                    // 对于匹配到的文件使用的处理loader
                    loader: "url-loader",
                    options: {
                        // placeholder name ext hash ..
                        name: "[name].[ext]",
                        outputPath: "images/",
                        // 小于200KB打包成base64个数
                        limit: 204800
                    }
                }
            },
            {
                test: /(\.modules\.suss)$/,
                // css文件通常需要两个loader进行c处理
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
            },
            {
                test: /\.(scss|css)$/,
                // css文件通常需要两个loader进行处理
                use: ["style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                        }
                    },
                    "sass-loader", "postcss-loader"
                ]
            },
            {
                // test: /\.(eot|ttf|svg|woff2?)$/,
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: ["file-loader"]
            },

        ]
    },
    output: {
        filename: "bundle.js",
        // 相对于当前(webpack.config.js)的dist文件夹下
        path: path.resolve(__dirname, "dist/")
    }
}