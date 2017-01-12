'use strict';
const INITIAL_PROJECT_LIST_URL = 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/api/data/projects.json';
const DATABASE_PATH = __dirname + '/data/';
const filename = DATABASE_PATH + '/project-data.json';
const fs = require( 'fs' )

    const Datastore = require( 'nedb' ),
        db = new Datastore({ filename: filename, autoload: true });
    const Hapi = require( 'hapi' );
    const server = new Hapi.Server( );
    const Axios = require( 'axios' );
    const port = 3333;
    const Path = require( 'path' );
    const Inert = require( 'inert' );
    const Zlib = require( 'zlib' );

    server.connection({
        port: port,
        compression: true,
        routes: {

            cors: true,

            files: {
                relativeTo: Path.join( __dirname, '../dist' )
            }

        }
    });

    server.register(Inert, ( ) => {});

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    });

    //server.ext('onPreResponse', addCorsHeaders);
    server.route({
        method: 'GET',
        path: '/projects',

        handler: function ( request, reply ) {

            const skip = request.query.skip || 0;;
            const limit = request.query.limit || ( skip + 10 );
            const sort = request.query.sort || 'title';
            const order = request.query.oder || 1;
            const t = request.query.t;
            const withLoc = request.query.withLoc;

            let sortParam = {};
            sortParam[sort] = order;

            let findParams = {};

            if ( t && t != '' ) {
                const text = t.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );
                findParams['$or'] = [
                    {
                        title: {
                            $regex: new RegExp( text, "i" )
                        }
                    }, {
                        project_id: {
                            $regex: new RegExp( text, "i" )
                        }
                    }, {
                        long_description: {
                            $regex: new RegExp( text, "i" )
                        }
                    }, {
                        'country.name': {
                            $regex: new RegExp( text, "i" )
                        }
                    }

                ];

            }

            if ( withLoc && withLoc == 'yes' ) {
                findParams['locations'] = {
                    $exists: true
                }
            }

            if ( withLoc && withLoc == 'no' ) {
                findParams['locations'] = {
                    $exists: false
                }
            }

            db.count( findParams, function ( err, count ) {
                db.find( findParams ).sort( sortParam ).skip(parseInt( skip )).limit(parseInt( limit )).exec( function ( err, docs ) {

                    reply({ projects: docs, count: count })
                });

            });

        }

    });

    server.route({
        method: 'GET',
        path: '/project/{id}',
        config: {
            cors: true
        },
        handler: function ( request, reply ) {

            db.findOne({
                project_id: request.params.id
            }, function ( err, project ) {
                reply( project );
            })

        }
    });

    server.route({
        method: 'DELETE',
        path: '/project/{id}',
        config: {
            cors: true
        },
        handler: function ( request, reply ) {

            db.remove({
                project_id: request.params.id
            }, function ( err, project ) {
                reply( true );
            })

        }
    });

    server.route({
        method: 'PUT',
        path: '/project/{id}',
        handler: function ( request, reply ) {
            debugger;
            delete request.payload._id;
            db.update({
                'project_id': request.params.id
            }, request.payload, {}, function ( err, numReplaced ) {
                reply( request.payload );
            });
        }
    });

    server.route({
        method: 'get',
        path: '/import-http',
        handler: function ( request, reply ) {
            const url = request.url.query.url
                ? request.url.query.url
                : INITIAL_PROJECT_LIST_URL;
            console.log( 'Getting data from: ' + url );
            Axios.get(url, {
                responseType: 'json',
                params: {}
            }).then( function ( response ) {
                for ( let i = 0; i < response.data.length; i++ ) {
                    db.findOne({
                        project_id: response.data[i].project_id
                    }, function ( err, project ) {
                        console.log( project );
                        if ( !project ) {
                            db.insert( response.data[i], function ( err, newDoc ) {
                                if ( err ) {
                                    console.log( 'error: ' + error );
                                } else {
                                    console.log( 'inserted' );
                                }
                            });
                        }
                    })
                }
                reply( 'Import completed' );
            }).catch( function ( response ) {
                console.log( 'fail!' );
                reply( 'Error' );
            });
        }
    });

    var Converter = require( "csvtojson" ).Converter;

    var readline = require( 'readline' ),
        stream = require( 'stream' );

    server.route({
        method: 'post',
        path: '/import-file',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            handler: function ( request, reply ) {

                var data = request.payload;

                if ( data.file ) {
                    var name = data.file.hapi.filename;
                    var path = __dirname + "/uploads/" + name;
                    var file = fs.createWriteStream( path );

                    file.on( 'error', function ( err ) {
                        console.error( err )
                    });

                    data.file.pipe( file );

                    data.file.on( 'end', function ( err ) {

                        var converter = new Converter({ });
                        converter.on( "record_parsed", function ( jsonObj ) {
                            db.findOne({
                                project_id: jsonObj.project_id
                            }, function ( err, project ) {

                                if ( !project ) {
                                    db.insert( jsonObj, function ( err, newDoc ) {
                                        if ( err ) {
                                            console.log( 'error: ' + error );
                                        } else {
                                            console.log( 'inserted' );
                                        }
                                    });
                                } else {
                                    console.log( 'Project already exists ' + jsonObj.project_id )
                                }
                            });
                        });

                        converter.on( "end_parsed", function ( ) {
                            console.log( "Completed" );
                            reply( 'Import completed' );
                        })

                        converter.on( "error", function ( ) {
                            console.log( "Failed" );

                        })

                        fs.createReadStream(path, { encoding: 'binary' }).pipe( converter );

                    })
                }

            }
        }
    });

    server.route({
        method: 'get',
        path: '/export',
        handler: function ( request, reply ) {
            const skip = request.query.skip || 0;;
            const limit = request.query.limit || ( 1000 );
            const sort = request.query.sort || 'title';
            const order = request.query.oder || 1;
            const t = request.query.t;
            const format = request.query.f
                ? request.query.f
                : 'geojson'
            let sortParam = {};
            sortParam[sort] = order;

            let findParams = {};

            if ( t && t != '' ) {
                const text = t.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );
                findParams['title'] = {
                    $regex: new RegExp( text, "i" )
                };
            }

            db.count( findParams, function ( err, count ) {
                db.find( findParams ).sort( sortParam ).skip(parseInt( skip )).limit(parseInt( limit )).exec( function ( err, docs ) {
                    const exportOjb = {
                        type: 'FeatureCollection',
                        features: [ ]
                    };
                    for ( let i = 0; i < docs.length; i++ ) {
                        if ( docs[i] && docs[i].locations ) {
                            for ( let j = 0; j < docs[i].locations.length; j++ ) {

                                exportOjb.features.push({
                                    type: 'Feature',
                                    geometry: {
                                        type: docs[i].locations[j].geometry.type,
                                        coordinates: docs[i].locations[j].geometry.coordinates.map( function ( c ) {
                                            return parseFloat( c )
                                        })
                                    },
                                    properties: {
                                        project_id: docs[i].project_id || '',
                                        title: docs[i].title || docs[i].alternate_title ||  docs[i].project_id  || '' ,
                                        long_description: docs[i].long_description || '',
                                        name: docs[i].locations[j].name || '',
                                        id: docs[i].locations[j].id || '',
                                        description: docs[i].locations[j].description || '',
                                        activity: docs[i].locations[j].activityDescription || '',
                                        country: docs[i].locations[j].country
                                            ? docs[i].locations[j].country.name
                                            : '',
                                        admin1: docs[i].locations[j].admin1
                                            ? docs[i].locations[j].admin1.name
                                            : '',
                                        admin2: docs[i].locations[j].admin2
                                            ? docs[i].locations[j].admin2.name
                                            : '',
                                        toponym: docs[i].locations[j].toponymName || '',
                                        designation: docs[i].locations[j].featureDesignation
                                            ? docs[i].locations[j].featureDesignation.code + ' - ' + docs[i].locations[j].featureDesignation.name
                                            : '',

                                        'class': docs[i].locations[j].locationClass
                                            ? docs[i].locations[j].locationClass.name
                                            : null,
                                        exactness: docs[i].locations[j].exactness
                                            ? docs[i].locations[j].exactness.name
                                            : ''
                                    }
                                });
                            }
                        }
                    }
                    if ( format === 'kml' ) {

                        const toKml = require( 'tokml' )
                        var kml = toKml(exportOjb, {
                            name: 'title'
                        });
                        const response = reply( kml ).hold( );
                        response.type( 'application/kml' );
                        response.header( 'Content-Disposition', 'attachment;filename="location.kml"' );
                        response.send( );

                    } else {
                        const response = reply( exportOjb ).hold( );
                        response.type( 'text/plain' );
                        response.header( 'Content-Disposition', 'attachment;filename="location.json"' );
                        response.send( );
                    }

                });
            });
        }
    });

    server.start(( err ) => {
        if ( err ) {
            throw err;
        }
        console.log( 'API running listening on', server.info.uri );
    });
