const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const packageJson = require("../package.json");
const assetsPath = '../assets/';
module.exports = {
  entry: {
    app: [
      "babel-polyfill",
      path.join(__dirname, assetsPath, 'index.js'),
    ],
    vendor: Object.keys(packageJson.dependencies).filter((item) => {
      return item != 'antd'
    })
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: "/"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.join(__dirname, assetsPath, 'components'),
      router: path.join(__dirname, assetsPath, 'router'),
      store: path.join(__dirname, assetsPath, 'store'),
      public: path.join(__dirname, assetsPath, 'public'),
      models: path.join(__dirname, assetsPath, 'models'),
      utils: path.join(__dirname, assetsPath, 'utils')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  'primary-color': '#26C8E1',
                  'link-color': '#26C8E1',
                  /*'font-size-base': '12px'*/
                }
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpg|gif|svg|pdf)$/,
        loader: 'file-loader',
        options: {
          name: 'static/img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|xlsx|xls)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:4].[ext]'
        }
      },
      /*{
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:4].[ext]'
        }
      }*/
    ]
  }
};

