var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var bodyParser = require('body-parser');
var Axios = require('axios');
var _ = require('lodash');
var Datastore = require('nedb'), db = new Datastore();

var app = express();
var devCompiler = webpack(config);

var server_port = 3000;
var mocks = {
    "projects": 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/API/api/data/projects.json'
}

  app.use(require('webpack-dev-middleware')(devCompiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(bodyParser.json());
  var publicPath = path.resolve(__dirname, 'assets/');
  app.use(express.static(publicPath));

  app.use(require('webpack-hot-middleware')(devCompiler));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/', 'index.html'));
  });

  app.listen(server_port, 'localhost', function(err) {
    if (err) {
      console.log(err);
      callback();
    }
    console.log('Listening at http://localhost:' + server_port);
  });

    app.use(function (req, res, next) {
        switch (req._parsedUrl.pathname) {
            case '/projects':
                db.find({}, function(err, projects) {
                    res.json(projects);
                });
                break;
            case '/project':
                if (req.method === 'GET') {
                    db.findOne({project_id: parseInt(req.query.id)}, function(err, project) {
                        res.json(project);
                    });
                } else if (req.method === 'PUT') {
                    delete req.body._id;
                    db.update({'project_id': parseInt(req.query.id)}, req.body, {}, function(err, numReplaced) {
                        res.json(req.body);
                    });
                }
                break;
            default :
                next();
        }
    });

    Axios.get(mocks.projects, {
        responseType: 'json',
        params: {}
    }).then(function(response) {
        console.log('insert projects docs into nedb');
        db.insert(response.data);
    }).catch(function(response) {
        console.log('fail!');
    });





