var path = require('path')
var VueLoaderPlugin = require('vue-loader/lib/plugin')

var HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html

module.exports = {
  entry: path.resolve(__dirname, '../example/index.js'), // 使用绝对路径
  output: {
    path: path.resolve('dist'), // 使用绝对路径
    filename: 'main.[hash:4].js',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue'] // 引入文件时候可以省略后缀
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      hash: true
    }),
    new VueLoaderPlugin()
  ]
}
