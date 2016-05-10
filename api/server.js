'use strict'
const INITIAL_PROJECT_LIST_URL = 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/api/data/projects.json';

const DATABASE_PATH = __dirname + '/data/';
const filename = DATABASE_PATH + '/project-data.json';
const Datastore = require('nedb'),
    db = new Datastore({ filename: filename, autoload: true });
const Hapi = require('hapi');
const server = new Hapi.Server();
const Axios = require('axios');
const port = 3333;

server.connection({
    port: port,
    routes: {

        cors: true
    }
});

//server.ext('onPreResponse', addCorsHeaders);
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
            const text=t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            findParams['title'] = {
                $regex: new RegExp(text, "i"),
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
        config: {
            cors: true,
        },
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
        delete request.payload._id;
        db.update({
            'project_id': parseInt(request.params.id)
        }, request.payload, {}, function(err, numReplaced) {
            reply(request.payload);
        });
    }
});

server.route({
    method: 'get',
    path: '/import-http',
    handler: function(request, reply) {
        const url = request.url.query.url ? request.url.query.url : INITIAL_PROJECT_LIST_URL;
        console.log('Getting data from: ' + url);
        Axios.get(url, {
            responseType: 'json',
            params: {}
        }).then(function(response) {
            for(let i = 0; i < response.data.length; i++) {
                db.findOne({
                    project_id: response.data[i].project_id
                }, function(err, project) {
                    //console.log(project);
                    if(!project) {
                        db.insert(response.data[i], function(err, newDoc) {
                            if(err) {
                                console.log('error: ' + error);
                            } else {
                                console.log('inserted');
                            }
                        });
                    }
                })   
            }
            reply('Import completed');
        }).catch(function(response) {
            console.log('fail!');
            reply('Error');
        });
    }
});

var Converter = require("csvtojson").Converter;
var converter = new Converter({});

server.route({
    method: 'post',
    path: '/import-file',
    config: {
        payload: {
            maxBytes: 209715200,
            output:'stream',
            parse: true
        },
        handler: function(request, reply) {
            converter.on("end_parsed", function (jsonArray) {
               console.log(jsonArray); //here is your result jsonarray
               reply('Import completed');
            });
            converter.on("record_parsed", function (jsonObj) {
                console.log(jsonObj); //here is your result json object 
                db.findOne({
                    project_id: jsonObj.project_id
                }, function(err, project) {
                    //console.log(project);
                    if(!project) {
                        db.insert(jsonObj, function(err, newDoc) {
                            if(err) {
                                console.log('error: ' + error);
                            } else {
                                console.log('inserted');
                            }
                        });
                    }
                });
            });
            request.payload["imported-file"].pipe(converter);
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('API running listening on', server.info.uri);
});