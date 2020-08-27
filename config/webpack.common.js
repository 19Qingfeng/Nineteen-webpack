const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
    entry: {
        main: path.resolve(__dirname, "../src/main.js"),
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
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
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
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            // enforceSizeThreshold: 50000,
            cacheGroups: {
                vendors: false,
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: "lodash",
                    priority: -10,
                    reuseExistingChunk: false
                },
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    // 配置plugin
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
            title: "19-webpack",
            filename: "wanghaoyu.html"
        }),
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: "[name].js",
        // publicPath: "/",
        // 相对于当前(webpack.config.js)的dist文件夹下
        path: path.resolve(__dirname, "../dist/")
    }
}