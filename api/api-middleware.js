var ApiUtil = require('./ApiUtil.js');

module.exports = function (req, res, next, db) {
  console.log('Request URL:', req.originalUrl);
    switch (req._parsedUrl.pathname) {
      case '/projects':
          /*ApiUtil.getProjectList().then(function (projects) {
              return res.json(projects);
          });*/
          db.find({}, function(err, projects) {
              res.json(projects);
          });
          break;

        case '/project':
            if (req.method === 'GET') {
                db.findOne({project_id: parseInt(req.query.id)}, function(err, project) {
                    res.json(project);
                });
            }
            if (req.method === 'PUT') {
                db.update({'project_id': parseInt(req.query.id)}, function(err, project) {
                    res.json(req.body);
                });
            }
            break;

        default :
          next();
    }
    };