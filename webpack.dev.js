const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.js')

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    disableHostCheck: true,
    publicPath: 'http://localhost:3000/static/',
    contentBase: __dirname,
    historyApiFallback: true,
    compress: true,
    port: 3000,
  },
  optimization: {
    minimize: false,
  },
}
