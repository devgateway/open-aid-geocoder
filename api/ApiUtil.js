var Axios = require('axios');
var _ = require('lodash');
var Datastore = require('nedb'), db = new Datastore();

var mocks = {
    "projects": 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/API/api/data/projects.json'
}

module.exports = {

    getProjectList: function(id){
        return new Promise(function (resolve, reject){
            Axios.get(mocks.projects, {
                responseType: 'json',
                params: {}
            })
                .then(function(response) {
                    console.log('sending response');
                    if (id) {
                        var result = _.filter(response.data, function(project) {
                            return project.project_id == id;
                        });
                        resolve(_.first(result));
                    } else {
                        resolve(response);
                    }
                })
                .catch(function(response) {
                    console.log('fail!');
                    reject();
                });
        });
    },

    getProject: function(id){
        return new Promise(function (resolve, reject){
            Axios.get(mocks.projects, {
                responseType: 'json',
                params: {}
            })
                .then(function(response) {
                    console.log('sending response');
                    if (id) {
                        var result = _.filter(response.data, function(project) {
                            return project.project_id == id;
                        });
                        resolve(_.first(result));
                    } else {
                        resolve(response);
                    }
                })
                .catch(function(response) {
                    console.log('fail!');
                    reject();
                });
        });
    },

    updateProject: function(project) {
        db.update({'project_id': project.project_id}, project);
    }
};