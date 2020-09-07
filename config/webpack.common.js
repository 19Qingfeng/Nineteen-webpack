const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const fs = require('fs')
const webpack = require("webpack")
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// custom plugin
const CopyRightWebpackPlugin = require("../mkPlugin/copyright-webpack-plugin");



const files = fs.readdirSync(path.resolve(__dirname, "../dll"))

const plugins = [
    new htmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
        title: "19-webpack",
        filename: "wanghaoyu.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyRightWebpackPlugin({
        name: "wanghaoyu"
    })
]


files.forEach(file => {
    if (/.*\.dll\.js$/.test(file)) {
        plugins.push(new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, "../dll", file)
        }))
    }
    if (/.*\.mainfest\.json/.test(file)) {
        plugins.push(
            new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, "../dll", file)
            }),
        )
    }
})

module.exports = {
    entry: {
        main: path.resolve(__dirname, "../src/main.js"),
    },
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "../mkloader")]
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
                // include:path.resolve(__dirname,'../src')
                use: [{
                        loader: "babel-loader"
                    },
                    // 自定义loader处理
                    {
                        loader: "replaceLoader",
                        // 传递参数 loader中使用this.query.name接收
                        options: {
                            name: "wanghaoyushijushenne!"
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                // css文件通常需要两个loader进行处理
                use: [MiniCssExtractPlugin.loader,
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
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        runtimeChunk: {
            name: "runtime"
        },
        splitChunks: {
            chunks: 'initial',
            minSize: 10240,
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
                    filename: "common.js",
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
    plugins,
    output: {
        filename: "[name].[contenthash].js",
        // publicPath: "/",
        // 相对于当前(webpack.config.js)的dist文件夹下
        chunkFilename: "[name].[contenthash].chunk.js",
        path: path.resolve(__dirname, "../dist/")
    }
}