var Datastore = require('nedb'), db = new Datastore();
var bodyParser = require('body-parser');
var _ = require('lodash');
var Axios = require('axios');

var INITIAL_PROJECT_LIST_URL = 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/OAGC-33/api/data/projects.json';

/**

 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports  = function routing(app){

	console.log('Adding API routes')

	console.log('initializing database')
    Axios.get(INITIAL_PROJECT_LIST_URL, {
        responseType: 'json',
        params: {}
    }).then(function(response) {
        console.log('insert projects docs into nedb ---> total: '+response.data.length);
        db.insert(response.data, function (err, newDoc) {   // Callback is optional
         console.log('error: '+err);
        });
    }).catch(function(response) {
        console.log('fail!');
    });

     app.use(bodyParser.json());
 

	app.get('/projects',function(req, res) {
        db.find({}, function(err, projects) {
            res.json(projects);
        });
	});

	app.get('/project/:id',function(req, res) {
        db.findOne({project_id: parseInt(req.params.id)}, function(err, project) {
            res.json(project);
        });
	});

	app.put('/project/:id',function(req, res) {
		delete req.body._id;
	    db.update({'project_id': parseInt(req.params.id)}, req.body, {}, function(err, numReplaced) {
	        res.json(req.body);
	    });
	});

}








