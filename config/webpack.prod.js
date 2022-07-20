// webpack配置文件
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// 封装stale函数
getStyleLoad = pre => [MiniCssExtractPlugin.loader,
    "css-loader",
{
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: [
                "postcss-preset-env",
            ]
        }
    }
},
    pre
].filter(Boolean)
module.exports = {
    // webpack 配置
    // 入口
    entry: './src/index.ts',
    // 输出
    output: {
        // 输出路径
        path: resolve(__dirname, '../dist'),
        // 输出文件名
        filename: "js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: "images/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
        clean: true,
        // publicPath: './'
    },
    // loader的配置
    // 下载 使用
    module: {
        rules: [
            // 详细loader配置
            {
                oneOf: [
                    {
                        // 匹配那些文件
                        test: /\.css$/,
                        // 使用哪些loader进行处理
                        /* use: [
                            // loader执行顺序从右至左，从下至上
                            // 创建style标签，将js中的css样式插入插入进行，放入head里面
                            'style-loader',
                            // 将css文件变成commonjs模块加载js中，里面内容是字符串
                            'css-loader'
                        ] */
                        use: getStyleLoad(),
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoad('less-loader')
                    },
                    // 打包图片
                    {
                        test: /\.(png|svg|jpg|gif|webp|jpeg)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                            },
                        },
                        // 输出图片名称
                        generator: {
                            filename: "./images/[hash][ext][query]"
                        },
                    },
                    {
                        test: /\.(ttf|woff|woff2)$/,
                        type: 'asset/resource',
                        // 输出字体名称
                        generator: {
                            filename: "./fonts/[hash][ext][query]"
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader',
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩
                            plugins: ["@babel/plugin-transform-runtime"],
                        }
                    },
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    }
                ]
            }
        ]
    },
    // plugins配置
    // 下载 引入 使用
    plugins: [
        // 详细plugins配置
        // html-webpack-plugin
        // 默认是一个空的，自动引入输出所有的js/css文件
        new HtmlWebpackPlugin({
            // 复制一个HTML文件
            template: resolve(__dirname, '../src/index.html'),
            minify: {
                collapseWhitespace: true, // 去除回车换行符以及多余空格
                removeComments: true, // 删除注释
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].chunk.css",
        }),
        new CssMinimizerPlugin(),
        new TerserPlugin({ test: /\.js$/}),
        new PreloadWebpackPlugin({
            rel: "preload", // preload兼容性更好
            as: "script",
            // rel: 'prefetch' // prefetch兼容性更差
        }),
    ],
    optimization: {
        minimizer: [
            // 压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
        },
    },
    // 模式，指定生产环境和开发环境
    // mode: 'development',//开发环境
    mode: 'production',//生产环境
    // 生成源映射
    devtool: "source-map",
}
