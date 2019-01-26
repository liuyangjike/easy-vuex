var merge = require('webpack-merge')
var baseConfig = require('./webpack.base')
var CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin('dist')
  ]
})
