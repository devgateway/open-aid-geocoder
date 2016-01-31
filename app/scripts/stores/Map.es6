import {
	createStore
}
from 'reflux';

import * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import {
	List, Map, Record
}
from 'immutable';
import {
	StoreMixins
}
from '../mixins/StoreMixins.es6';

import LocationsGeoJson from './LocationsGeo.es6';
import CountryGeo from './CountryGeo.es6';
import ProjectStore from './Project.es6';
import ProjectGeo from './ProjectGeo.es6';


/*This store should be renamed to geocoding and should actually manage the state of teh coding data  whic*/
const PopUpStore = createStore({

	initialData: {
		map: {
			center: [0.0, 0.0],
			zoom: 3,
			boxZoom: true,
			zoomControl: false
		},
		layers: {
			countries: [],
			locations: null,
			geocoding: null
		},
		popup: {
			mode: 'info',
			data: {

			}
		},
		project: null,
		activeLocation: null,
		geocoding: null,
		clickedLocationPosition: null
	},

	mixins: [StoreMixins],

	init() {

		this.listenTo(ProjectStore, this.onProjectUpdate);
		this.listenTo(ProjectGeo, this.updateProjectLocations);
		this.listenTo(LocationsGeoJson, this.updateLocations);
		this.listenTo(CountryGeo, this.updateCountry);
		this.listenTo(Actions.get(Constants.ACTION_POPUP_INFO), 'updatePopupInfo');
		this.listenTo(Actions.get(Constants.ACTION_OPEN_DATAENTRY_POPUP), 'closeInfoWindow');
		this.listenTo(Actions.get(Constants.ACTION_SET_ACTIVE_LOCATION), 'setActiveLocation');
		this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');
	},

	cleanStore() {
		debugger; 
    	this.setData(this.initialData);
	},

	getInitialState() {
		return this.get();
	},

	setActiveLocation(params) {
		const {
			locationFeature, isCoded
		} = params;
		var newState = Object.assign({}, this.get());
		if (isCoded) {
			newState.activeLocation = this.getFeatureFromCoded(locationFeature);
		} else {
			newState.activeLocation = locationFeature;
		}
		this.setData(newState);
	},

	getFeatureFromCoded(data) {
		return {
			'fcode': data.featureDesignation.code,
			'fcodeName': data.featureDesignation.name,
			'geonameId': data.id,
			'lat': data.geometry.coordinates[1],
			'lng': data.geometry.coordinates[0],
			'name': data.name,
			'toponymName': data.toponymName,
			'activityDescription': data.activityDescription
		};
	},

	updateLocations(data) {
		var newState = Object.assign({}, this.get())
		newState.layers.locations = data;

		Object.assign(newState, {
			popup: {
				'open': false
			}
		});

		this.setData(newState);
	},

	updateCountry(data) {

		var newState = Object.assign({}, this.get())
		newState.layers.countries = data.countries;
		this.setData(newState);
	},

	onProjectUpdate(project) {
		var newState = Object.assign({}, this.get())
		newState.project = project;
		this.setData(newState);
		if (project.country) {
			//	Actions.invoke(Constants.ACTION_ADD_COUNTRY_LAYER, project.country.iso3);
		}
	},

	closeInfoWindow(params) {
		this.setData(Object.assign({}, this.get(), {
			popup: {
				'open': false
			}
		}));
	},

	updateProjectLocations(data) {
		debugger;
		var newState = Object.assign({}, this.get())
		newState.geocoding = data.geojson;
		this.setData(newState);
	},

	updatePopupInfo(properties) {
		const {countryFeature, locationFeature, position} = properties;
		const {ID_0, ID_1, GAUL01, ID_2, GAUL02, NAME_0, Country, NAME_1, ADM1, NAME_2, ADM2} = (countryFeature) ? countryFeature.properties: {}; //TODO: normalize field extraction
		const {
			fclName, adminCode1, adminCode2, adminId1, adminId2, adminName1, adminName2, adminName3, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryId, countryName, activityDescription
		} = locationFeature.properties;
		const params = {
			ID_0: (ID_0 || GAUL02),
			ID_1: (ID_1 || GAUL01),
			ID_2: (ID_2 || GAUL02),
			NAME_0: (NAME_0 || Country),
			NAME_1: (NAME_1 || ADM1),
			NAME_2: (NAME_2 || ADM2),
			...locationFeature.properties
		};

		if (locationFeature.properties.type == 'geocoding') {
			var geocoding = locationFeature.properties;
			this.addAdminCodes(geocoding, params);
		} else {
			var geocoding = this.makeGeocodingObject(params);
			this.addAdminCodes(geocoding, params);
		}
		/*creates info window parameters */
		this.setData(Object.assign({}, this.get(), {
			popup: {
				'open': true,
				'position': position,
				'location': geocoding
			}
		}));
	},

	makeGeocodingObject(params) {
		let model = {
			'name': params.name,
			'id': params.geonameId,
			'activityDescription': params.activityDescription || '',
			'geometry': {
				"type": "Point",
				"coordinates": [params.lng, params.lat]
			},

			'toponymName': params.toponymName,
			'featureDesignation': {
				code: params.fcode,
				name: params.fcodeName
			},
			'type': params.type || 'location',
			'status': params.status || 'EXISTING',
			'locationClass': params.locationClass || null, //{code:''m,name:''}
			'exactness': params.exactness || null, // {{"code": "1", "name": "Exact"}

		}
		return model;
	},

	addAdminCodes(model, params) {
		debugger;
		var adminCodes = {
			geonames: {
				'country': {
					code: params.countryId,
					name: params.countryName
				},
				'admin1': {
					code: params.adminId1,
					name: params.adminName1
				},
				'admin2': {
					code: params.adminId2,
					name: params.adminName2
				}
			}
		}

		if (params.ID_0 && params.ID_1 && params.ID_2) {
			Object.assign(adminCodes, {
				shape: {
					'country': {
						code: params.ID_0,
						name: params.NAME_0
					},
					'admin1': {
						code: params.ID_1,
						name: params.NAME_1
					},
					'admin2': {
						code: params.ID_2,
						name: params.NAME_2
					}
				}
			})
		}
		Object.assign(model, {
			adminCodes
		})
	},


});

export default PopUpStore;