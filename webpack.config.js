const path = require("path")
const webpack = require('webpack')

const config = {
    context: path.resolve('./src'),
    entry: './index',
    output: {
        path: path.resolve('./static/'),
        filename: "[name].js",
    },
    module: {
        loaders: [
            { 
                test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader', 
                query: { presets:['react','es2015','stage-2'] }
                // stage 2 so we can use JS spread operator 
            }
        ],
    },
    resolve: {
        root: [
            path.resolve('./src'),
        ],
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js'],
    },
}

module.exports = config