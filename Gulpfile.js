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
prodCompiler = webpack(prodConfig),
eslint = require('gulp-eslint'),
 jshint = require('gulp-jshint');

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
 gulp.task("build:webpack-prod",["copy-files"], function(callback) {
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

  app.use(require('webpack-dev-middleware')(devCompiler, {
    noInfo: true
  }));
  app.use(require('webpack-hot-middleware')(devCompiler, {
    reload: true,
    noInfo: false,
    quiet: false
  }));

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
 gulp.task('open-dev', ['server', 'start-api'], function() {
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


/**
 * Start Mock API
 */
 gulp.task('start-api', function() {
  nodemon({
    script: './api/server.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  })
})


 gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['./app/**/*.js','./app/**/*.jsx','./app/**/*.es6','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({es6:true,browser:true,maxerr: 20,curly:true,eqeqeq:true}))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
      });



 gulp.task('hint', function() {
  return gulp.src('./app/**/*.*')
    .pipe(jshint({esversion:6}))
    .pipe(jshint.reporter('default', { verbose: true }));
});



gulp.task('copy-files', function() {
 
  gulp.src(['app/locales/**/*']).pipe(gulp.dest('dist/locales'));
  gulp.src(['app/conf/**/*']).pipe(gulp.dest('dist/conf'));

});
