/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

/** @format */

const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin");//引入

const isProd = process.env.NODE_ENV !== 'development'
const env = process.env.NODE_ENV || 'production'
const distPath = path.join(__dirname, '../dist')
const srcPath = path.join(__dirname, '../src')

const config = {
    development: {
        publicPath: '',
    },
    dev: {
        publicPath: 'http://tomato.harsons.cn/app/card-dev/',
    },
    test: {
        publicPath: 'http://tomato.harsons.cn/app/card-test/',
    },
    production: {
        publicPath: 'http://tomato.harsons.cn/app/card/',
    },
}
module.exports = {
    mode: isProd ? 'production' : 'development',
    entry: {
        index: path.join(srcPath, 'index.tsx'),
        vendors: ['react', 'react-dom', 'react-router-dom'],
    },
    output: {
        path: distPath,
        filename: 'js/[name].[hash].js',
        publicPath: config[env].publicPath,
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            include: [srcPath],
            exclude: [/node_modules/],
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.less$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true,


                        modifyVars: {
                            'border-radius-base': '4px',
                        },
                    },
                },
            ],
        },
        {
            test: /\.svg$/,
            loader: 'svg-sprite-loader',
            include: [path.join(srcPath, 'icons')],
            options: {
                symbolId: 'icon-[name]',
            },
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            exclude: [path.join(srcPath, 'icons')],
            options: {
                esModule: false,
                name: 'imgs/[name].[ext]?[hash]',
            },
        },
        ],
    },
    resolve: {
        alias: {
            '@': srcPath,
        },
        extensions: ['.js', '.ts', '.tsx'],
    },
    devtool: isProd ? '' : 'source-map',
    devServer: {
        historyApiFallback: true,
        port: 3003,
        contentBase: ['./'],
        inline: true,
        publicPath: '/',
        hot: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: '华胜运营管理后台',
            template: path.join(srcPath, 'index.ejs'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            allChunks: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: `"${env}"` },
        }),
        new CompressionPlugin({
            // asset: distPath + '.gz[query]',
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
            // deleteOriginalAssets: true,
        })
    ],
    externals: {
        'BMapGL': 'BMapGL'
    },
}