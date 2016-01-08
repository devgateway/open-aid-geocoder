var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');


var app = express();
var devCompiler = webpack(config);
var API = require('./api/API.js'); 
var server_port = 3333;



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
	
	app.use(allowCrossDomain);
 
 API(app);

  app.listen(server_port, function(err) {
    if (err) {
      console.log(err);
      callback();
    }
    console.log('Listening at http://localhost:' + server_port);
  });



 




