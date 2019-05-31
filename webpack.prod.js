const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const baseConfig = require('./webpack.base.js')

module.exports = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: __dirname + '/dist/build',
    filename: 'main.js',
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}
