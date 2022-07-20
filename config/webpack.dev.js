// webpack配置文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    // webpack 配置
    // 入口
    entry: './src/index.ts',
    // 输出
    output: {
        // 输出文件名
        filename: 'main.js',
        // 输出路径 ps:开发环境没有输出
        path: undefined
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
                        use: [MiniCssExtractPlugin.loader, "css-loader"],
                    },
                    {
                        test: /\.less$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            'less-loader'
                        ]
                    },
                    // 打包图片
                    {
                        test: /\.(png|svg|jpg|gif|webp|jpeg)$/,
                        type: 'asset',
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
                        test:/\.ts$/,
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
            template: './src/index.html',
            // minify: {
            //     collapseWhitespace: true, // 去除回车换行符以及多余空格
            //     removeComments: true, // 删除注释
            // }
        }),
        new MiniCssExtractPlugin()
    ],
    devServer: {
        host:'localhost',
        open: true,
        port: 9000,
        hot: true,
    },
    // 模式，指定生产环境和开发环境
    mode: 'development',//开发环境
//     mode: 'production',//生产环境
    // 生成源映射
    devtool: "cheap-module-source-map",
}
