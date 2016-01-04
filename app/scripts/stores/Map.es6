import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

import ProjectGeoJson from './ProjectGeo.es6';
import ProjectStore from './Project.es6';
import LocationsGeoJson from './LocationsGeo.es6';
import CountryGeo from  './CountryGeo.es6';


/*This store should be renamed to geocoding and should actually manage the state of teh coding data  whic*/
const PopUpStore = createStore({

	initialData: {
		map: {
			center: [0.0, 0.0],
			zoom: 3
		},
		layers: {
			country: [],
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
			this.listenTo(LocationsGeoJson, this.updateLocations);
			this.listenTo(CountryGeo, this.updateCountry);
			this.listenTo(ProjectStore, this.onProjectUpdate);
			this.listenTo(ProjectGeoJson, this.updateProjectLocations);
			this.listenTo(Actions.get(Constants.ACTION_POPUP_INFO), 'updatePopupInfo');
			this.listenTo(Actions.get(Constants.ACTION_CODE_LOCATION), 'updatePopupDataEntry');
			this.listenTo(Actions.get(Constants.ACTION_SET_ACTIVE_LOCATION), 'setActiveLocation');

		},

		getInitialState() {
			return this.get();
		},
		
		setActiveLocation(locationFeature) {
			var newState = Object.assign({}, this.get());
			newState.activeLocation = locationFeature;
			this.setData(newState);
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

		updateProjectLocations(data) {
			var newState = Object.assign({}, this.get())
			newState.geocoding = data.geojson;
			this.setData(newState);
		},

		onProjectUpdate(data) {
			var newState = Object.assign({}, this.get())
			newState.project = data.project.data;
			this.setData(newState);
 			Actions.invoke(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST);//loads country layer list
 			if (data.project.data.country){
				Actions.invoke(Constants.ACTION_ADD_COUNTRY_LAYER, data.project.data.country.iso3);
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

		updatePopupInfo(params) {

			const {countryFeature, locationFeature, position} = params;

			if (!countryFeature) {
				console.log("COUNTRY INFO IS EMPTY .....")
			}
			/*Country properties*/
			/*Geonames properties*/
			const {
				fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryName, adminCode1, adminName1
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


		makeGeocodingObject(params){
			return {
			
						'name': params.name,
						'id': params.geonameId,
						'description': '',
						'activityDescription': '',
						'country': {
							lvel:0,
							name: params.NAME_0
						},
						'admin1': {
							lvel:1,
							name: params.NAME_1
						},
						'admin2': {
							lvel:2,
							name: params.NAME_2
						},

						'geometry': {
							"type": "Point",
							"coordinates": [params.lng, params.lat]
						},

						'toponymName': params.toponymName,
						'featureDesignation': {
							code: params.fcode,
							name: params.fcodeName
						},
						'type':'location',
						'status':'NEW',
						'locationClass': null,
						'exactness': null,
					
				
			}
		}
	});


export default PopUpStore;