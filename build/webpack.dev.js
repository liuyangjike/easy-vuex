var merge = require('webpack-merge')
var path = require('path')
var baseConfig = require('./webpack.base')
var webpack = require('webpack')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    port: 8000,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // css热更新
  ]
})
