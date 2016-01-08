var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');


var app = express();
var devCompiler = webpack(config);
var API = require('./api/API.js'); 
var server_port = 3333;

  API(app);

  app.listen(server_port, function(err) {
    if (err) {
      console.log(err);
      callback();
    }
    console.log('Listening at http://localhost:' + server_port);
  });



 




