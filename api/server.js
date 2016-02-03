'use strict'
const INITIAL_PROJECT_LIST_URL = 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/api/data/projects.json';
const Datastore = require('nedb'),
    db = new Datastore();
const Hapi = require('hapi');
const server = new Hapi.Server();
const Axios = require('axios');
const port = 3001;

server.connection({
    host: 'localhost',
    port: port,
    routes: {
        cors: true
    }
});

server.route({
    method: 'GET',
    path: '/projects',

    handler: function(request, reply) {

        const skip = request.query.skip || 0;;
        const limit = request.query.limit || (skip + 10);
        const sort = request.query.sort || 'title';
        const order = request.query.oder || 1;
        const t = request.query.t;
        const withLoc = request.query.withLoc;

        let sortParam = {};
        sortParam[sort] = order;

        let findParams = {};


        if (t && t != '') {
            findParams['title'] = {
                $regex: new RegExp(t, "i")
            };
        }

        if (withLoc && withLoc == 'yes') {
            findParams['locations'] = {
                $exists: true
            }
        }

        if (withLoc && withLoc == 'no') {
            findParams['locations'] = {
                $exists: false
            }
        }

        db.count(findParams, function(err, count) {
            db.find(findParams).sort(sortParam).skip(parseInt(skip)).limit(parseInt(limit)).exec(function(err, docs) {
                reply({
                    projects: docs,
                    count: count
                })
            });

        });

    }

});


server.route({
        method: 'GET',
        path: '/project/{id}',

        handler: function(request, reply) {
            
            db.findOne({
                project_id: parseInt(request.params.id)
            }, function(err, project) {
                reply(project);
            })
            
        }
});



server.route({
    method: 'PUT',
    path: '/project/{id}',
    handler: function(request, reply) {
        delete req.body._id;
        db.update({
            'project_id': parseInt(request.params.id)
        }, req.body, {}, function(err, numReplaced) {
            res.json(req.body);
        });

    }
});



Axios.get(INITIAL_PROJECT_LIST_URL, {
    responseType: 'json',
    params: {}
}).then(function(response) {

    console.log('inserting projects docs into nedb ---> total: ' + response.data.length);

    db.insert(response.data, function(err, newDoc) {
        if (err) {
            console.log('error: ' + err);
        } else {


            server.start((err) => {
                if (err) {
                    throw err;
                }
                console.log('API running listening on', server.info.uri);
            });

        }
    });

}).catch(function(response) {
    console.log('fail!');
});


/*

 module.exports = function routing(app) {

  

    app.use(bodyParser.json());


    app.get('/projects', function(req, res) {
      

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
*/