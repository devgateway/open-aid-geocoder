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
			zoom: 3,
			boxZoom:true,
			zoomControl:false
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
			newState.layers.countries = data.countries ;
			this.setData(newState);
		},

		onProjectUpdate(project) {
			var newState = Object.assign({}, this.get())
			newState.project = project;
			this.setData(newState);
 			if (project.country){
			//	Actions.invoke(Constants.ACTION_ADD_COUNTRY_LAYER, project.country.iso3);
	 		}
 	 	},

		closeInfoWindow(params) {
			
			this.setData(Object.assign({}, this.get(), {
				popup: {
					'open':false
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
		
			const {
				CC_2, ENGTYPE_2, HASC_2, ID_0, ID_1, ID_2, ISO, NAME_0, NAME_1, NAME_2, NL_NAME_2, TYPE_2 , 
				ADM1,ADM2,GAUL01,GAUL02,FAO_2ID,FAO_2,Country

			} = (countryFeature) ? countryFeature.properties: {}; //TODO: normalize field extraction

			/*Geonames properties*/
			const {
				fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryName, adminCode1, adminName1, activityDescription
			} = locationFeature.properties;
			
			if (locationFeature.properties.type == 'geocoding'){
				var geocoding = locationFeature.properties;	
				geocoding.layer = this.makeGeocodingObject({
					ID_0, ID_1, ID_2, NAME_0, NAME_1, NAME_2, 
					fcode: locationFeature.properties.featureDesignation.code, 
					fcodeName: locationFeature.properties.featureDesignation.name, 
					geonameId: locationFeature.properties.id, 
					lat: locationFeature.properties.geometry.coordinates[1],
					lng: locationFeature.properties.geometry.coordinates[0], 
					name: locationFeature.properties.name, 
					toponymName: locationFeature.properties.toponymName,
					type: locationFeature.properties.type,
					locationClass: locationFeature.properties.locationClass,
					exactness: locationFeature.properties.exactness,
					status: locationFeature.properties.status,
					activityDescription: locationFeature.properties.activityDescription
				});
			} else {					
				var geocoding = this.makeGeocodingObject({
					ID_0:(ID_0||GAUL02), ID_1:(ID_1||GAUL01), ID_2:(ID_2||GAUL02), NAME_0:(NAME_0||Country), NAME_1:(NAME_1||ADM1), NAME_2:(NAME_2||ADM2), 
					fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName
				});
			}

			/*creates info window parameters */
			this.setData(Object.assign({}, this.get(), {
				popup: {
					'open':true,
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
