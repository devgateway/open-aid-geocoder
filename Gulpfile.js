var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var os = require('os');

var ghPages = require('gulp-gh-pages');

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var open = require('gulp-open');

var server_port = 3000;
  var app = express();


var webpackConfig = require("./webpack.config.dev.js");
var devConfig = Object.create(webpackConfig);


var webpackProdConfig = require("./webpack.config.prod.js");
var prodConfig = Object.create(webpackProdConfig);



var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));




gulp.task("default", ["build-dev", "server","open-dev"]);


var devCompiler = webpack(devConfig);

gulp.task("build-dev", function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("build-dev", err);
    gutil.log("[build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});


var prodCompiler = webpack(prodConfig);

gulp.task("build-prod", function(callback) {
  // run webpack
  prodCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("build-prod", err);
    gutil.log("[build-prod]", stats.toString({
      colors: true
    }));
    callback();
  });
});


gulp.task("server", function(callback) {

  app.use(require('webpack-dev-middleware')(devCompiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(devCompiler));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/', 'index.html'));
  });

  app.listen(server_port, 'localhost', function(err) {
    if (err) {
      console.log(err);
      callback();
    }
    console.log('Listening at http://localhost:' + server_port);
  });




});



 
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


gulp.task('open-dev', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:'+server_port}));
})


