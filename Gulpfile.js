var gulp = require("gulp"),
gutil = require("gulp-util"),
webpack = require("webpack"),
os = require('os'),
ghPages = require('gulp-gh-pages'),
path = require('path'),
express = require('express'),
webpack = require('webpack'),
config = require('./webpack.config.dev'),
nodemon = require('nodemon'),
open = require('gulp-open'),
server_port = 3000,
app = express(),
webpackConfig = require("./webpack.config.dev.js"),
devConfig = Object.create(webpackConfig),
webpackProdConfig = require("./webpack.config.prod.js"),
prodConfig = Object.create(webpackProdConfig),
browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox')),
devCompiler = webpack(devConfig),
prodCompiler = webpack(prodConfig);

gulp.task("default", ["open-dev"]);
gulp.task("build-prod", ["set-prod-node-env", "build:webpack-prod"]);
gulp.task("deploy", ["gh_pages"]);

/**
 * Developoment build
 */
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


/**
 * Production build
 */
 gulp.task("build:webpack-prod", function(callback) {
  // run webpack
  prodCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("build-prod", err);
    gutil.log("[build-prod]", stats.toString({
      colors: true
    }));
    callback();
  });
});

/**
 * Start dev web server
 */
 gulp.task("server", function(callback) {

  app.use(require('webpack-dev-middleware')(devCompiler, {noInfo: true}));
  app.use(require('webpack-hot-middleware')(devCompiler,{reload :true,noInfo :false,quiet :false}));

  var publicPath = path.resolve(__dirname, 'app/');
  app.use(express.static(publicPath));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/', 'index.html'));
  });

  app.listen(server_port, 'localhost', function(err) {
    if (err) {
      callback(err);
    }
    console.log('Listening at http://localhost:' + server_port);
    callback();
  });

});

/**
 * Publish dist folder into gh_pages branch
 */
 gulp.task('gh_pages', ["set-prod-node-env", "build:webpack-prod"], function() {
  return gulp.src('./dist/**/*')
  .pipe(ghPages());
});


/**
 * open development url
 */
 gulp.task('open-dev', ['server','start-api'], function() {
  gulp.src(__filename)
  .pipe(open({
    uri: 'http://localhost:' + server_port
  }));
})


 gulp.task('set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

 gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});

 gulp.task('start-api', function () {
  nodemon({
    script: './api/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

 