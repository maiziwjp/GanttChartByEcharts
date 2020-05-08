const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonConfig = require('./webpack.common.conf.js');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
    ]
  },
  output: {
    filename: '[name].[hash:8].js',
    publicPath: '/static/'
  },
  devServer: {
    historyApiFallback: {
      index: '/static/index.html'
    },
    overlay: {
      errors: true
    },
    host: 'localhost', //默认localhost 30.43.100.154
    // host: '30.43.105.66',
    // port: '9999', //默认端口8080
    // 配代理
    disableHostCheck: true, //  新增该配置项
    proxy: {
      '/healthApi': {
        target: 'http://120.79.231.12:8042',
        // target: 'http://172.20.10.3:8080',
        changeOrigin: true,
        headers: {
          'token':'good-token'
        },
        pathRewrite: {
          '^/healthApi': ''
        }
      }
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../assets/index.html')
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      allChunks: false
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: 'static',
    //     ignore: ['.*']
    //   }
    // ])
  ]
})

