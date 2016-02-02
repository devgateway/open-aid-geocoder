var path = require('path');
var webpack = require('webpack');


module.exports = {

  devtool: "source-map", // or "inline-source-map"
  entry: [
    'webpack-hot-middleware/client',
    './app/scripts/app'
  ],
  output: {
    path: path.join(__dirname,'tmp'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx|es6)$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.png$/,
      loader: "url-loader?limit=100000"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }]
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react'),
      'i18next': 'i18next/lib/index.js',
      'i18next-xhr-backend':'i18next-xhr-backend/lib/index.js'
      
    },
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx",".es6"]
  }

};