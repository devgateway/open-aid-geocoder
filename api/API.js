var Datastore = require('nedb'),
db = new Datastore();
var bodyParser = require('body-parser');
var _ = require('lodash');
var Axios = require('axios');
var jsonfile = require('jsonfile')


var INITIAL_PROJECT_LIST_URL = 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/api/data/projects.json';

/**
 
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
 module.exports = function routing(app) {

    console.log('Adding API routes')

    console.log('initializing database')
    Axios.get(INITIAL_PROJECT_LIST_URL, {
        responseType: 'json',
        params: {}
    }).then(function(response) {

        console.log('inserting projects docs into nedb ---> total: ' + response.data.length);

        db.insert(response.data, function(err, newDoc) { // Callback is optional
            console.log('error: ' + err);
        });
        
    }).catch(function(response) {
        console.log('fail!');
    });

    app.use(bodyParser.json());


    app.get('/projects', function(req, res) {
        var skip = req.param('skip') || 0;;
        var limit = req.param('limit') || (skip+10);
        var sort = req.param('sort') || 'title';
        var order = req.param('oder') || 1;
        var t=req.param('t');
        var withLoc=req.param('withLoc');




        var sortParam = {};
        sortParam[sort] = order;

        var findParams={};
       
        if (t){
 		    findParams['title']={$regex: new RegExp(t,"i")};
        }

        if (withLoc && withLoc=='yes'){
            findParams['locations']={ $exists: true }
        }

        if(withLoc && withLoc=='no'){
            findParams['locations']={ $exists: false }
        }
        
        db.count(findParams, function (err, count) {
  
        db.find(findParams).sort(sortParam).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err, docs) {
          debugger;
            res.json({
                projects:docs,
                count:count
            })
        });

        });

    });

    app.get('/project/:id', function(req, res) {
        db.findOne({
            project_id: parseInt(req.params.id)
        }, function(err, project) {
            res.json(project);
        });
    });

    app.put('/project/:id', function(req, res) {
        delete req.body._id;
        db.update({
            'project_id': parseInt(req.params.id)
        }, req.body, {}, function(err, numReplaced) {
            res.json(req.body);
        });
    });

}