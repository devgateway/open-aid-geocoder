import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

import LocationsGeoJson from './LocationsGeo.es6';
import CountryGeo from  './CountryGeo.es6';
import ProjectStore from './Project.es6';
import ProjectGeo  from './ProjectGeo.es6';
/*This store should be renamed to geocoding and should actually manage the state of teh coding data  whic*/
const PopUpStore = createStore({

	initialData: {
		map: {
			center: [0.0, 0.0],
			zoom: 3
		},
		layers: {
			country: null,
			locations: null,
			geocoding: null
		},
		popup: {
			mode: 'info',
			data: {

			}
		},
		clickedLocationPosition: null
	},
	
	mixins: [StoreMixins],

		init() {
			
			this.listenTo(ProjectStore, this.onProjectUpdate);
			this.listenTo(ProjectGeo, this.updateProjectLocations);
			this.listenTo(LocationsGeoJson, this.updateLocations);
			this.listenTo(CountryGeo, this.updateCountry);

			this.listenTo(Actions.get(Constants.ACTION_POPUP_INFO), 'updatePopupInfo');
			this.listenTo(Actions.get(Constants.ACTION_CODE_LOCATION), 'updatePopupDataEntry');
			this.listenTo(Actions.get(Constants.ACTION_SET_ACTIVE_LOCATION), 'setActiveLocation');

		},

		getInitialState() {
			return this.get();
		},
		
		setActiveLocation(params) {
			const {locationFeature, isCoded} = params;
			var newState = Object.assign({}, this.get());
			if (isCoded){ 
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
			this.setData(newState);
		},

		updateCountry(data) {
			var newState = Object.assign({}, this.get())
			newState.layers.country = data.countryLayer;
			this.setData(newState);
		},

		onProjectUpdate(project) {
			var newState = Object.assign({}, this.get())
			newState.project = project;
			this.setData(newState);
 			Actions.invoke(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST);//loads country layer list
 			if (project.country){
				Actions.invoke(Constants.ACTION_ADD_COUNTRY_LAYER, project.country.iso3);
	 		}
 	 	},

		updatePopupDataEntry(params) {
			this.setData(Object.assign({}, this.get(), {
				popup: {
					'position': params.position,
					location: null
				}
			}));
		},

		updateProjectLocations(data) {
			var newState = Object.assign({}, this.get())
			newState.geocoding = data.geojson;
			this.setData(newState);
		},

		updatePopupInfo(params) {

			const {countryFeature, locationFeature, position} = params;

			if (!countryFeature) {
				console.log("COUNTRY INFO IS EMPTY .....")
			}
			/*Country properties*/
			const {
				CC_2, ENGTYPE_2, HASC_2, ID_0, ID_1, ID_2, ISO, NAME_0, NAME_1, NAME_2, NL_NAME_2, TYPE_2
			} = (countryFeature) ? countryFeature.properties: {}; //TODO: normalize field extraction

			/*Geonames properties*/
			const {
				fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryName, adminCode1, adminName1, activityDescription
			} = locationFeature.properties;

			const geocoding = this.makeGeocodingObject({
				NAME_0, NAME_1, NAME_2, fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName
			});
			/*creates info window parameters */
			this.setData(Object.assign({}, this.get(), {
				popup: {
					'position': position,
					location: geocoding
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
				'type': 'location',
				'status': 'NEW',
				'locationClass': null, //{code:''m,name:''}
				'exactness': null, // {{"code": "1", "name": "Exact"}
			}

			if (params.NAME_0) {
				model = Object.assign(model, {
					'country': {
						code: params.ID_0,
						name: params.NAME_0
					}
				});
			}

			if (params.NAME_1) {
				model = Object.assign(model, {
					'admin1': {
						code: params.ID_1,
						name: params.NAME_1
					}
				});
			}

			if (params.NAME_2) {
				model = Object.assign(model, {
					'admin2': {
						code: params.ID_2,
						name: params.NAME_2
					}
				});
			}

			return model;
		}
	});


export default PopUpStore;