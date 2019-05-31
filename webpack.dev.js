const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.js')

module.exports = {
  ...baseConfig,
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    disableHostCheck: true,
    publicPath: 'http://localhost:3000/build/',
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'public')],
    historyApiFallback: true,
    compress: true,
    port: 3000,
  },
  optimization: {
    minimize: false,
  },
}
