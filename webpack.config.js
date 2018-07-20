const path = require('path')
const webpack = require('webpack')


const baseConfig = {
  output: {
      path: path.resolve(__dirname, 'static'),
      filename: '[name].js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ]
  },
}

const mainConfig = Object.assign({}, baseConfig, {
  entry: {
    main: './src/index',
  },
  module: {
    rules: [
      {
        test: /worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: 'build.worker.js',
            publicPath: '/static/'
          },
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
        ]
      }
    ]
  },
})

module.exports = [mainConfig]
