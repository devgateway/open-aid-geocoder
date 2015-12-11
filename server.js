var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');


var app = express();
var devCompiler = webpack(config);

var server_port = 3000;

app.use(require('webpack-dev-middleware')(devCompiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));


  var publicPath = path.resolve(__dirname, 'assets/');
  app.use(express.static(publicPath));


  app.use(require('webpack-hot-middleware')(devCompiler));



  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/', 'index.html'));
  });


  app.get('/projects', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/', 'index.html'));
  });




  app.listen(server_port, 'localhost', function(err) {
    if (err) {
      console.log(err);
      callback();
    }
    console.log('Listening at http://localhost:' + server_port);
  });





