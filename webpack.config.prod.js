var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin=require('copy-webpack-plugin');
module.exports = {

  devtool: "source-map", // or "inline-source-map"
  entry: ['./app/scripts/app'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
    
  },


  plugins: [
  new CopyWebpackPlugin([{ from: './app/conf', to: 'conf'}], {force:true}),
  new CopyWebpackPlugin([{ from: './app/locales', to: 'locales'}], {force:true}),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}
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
    },

    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }, 
    {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.wav$|\.mp3$/,
      loader: "file"
    }, {
      test: /\.css$|\.scss$/,
      loader: ExtractTextPlugin.extract(
          'style', // backup loader when not building .css file
          'css!sass' // loaders to preprocess CSS
          )
    }
    ]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
  }
};