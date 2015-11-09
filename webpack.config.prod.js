var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {

  devtool: "source-map", // or "inline-source-map"
  entry: [
    'webpack-hot-middleware/client',
    './app/scripts/app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './'
  },


  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template:'app/html/index-prod.html',
      inject: true}
      )
  ],


  module: {
    loaders: [{
      test: /\.(js|jsx|es6)$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
      loader: "file"
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        'style', // backup loader when not building .css file
        'css!sass' // loaders to preprocess CSS
      )
    }]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
  }
};