const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const baseConfig = require('./webpack.base.js')

module.exports = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: __dirname + '/static/',
    filename: 'main.js',
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}
