import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

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
			country: null,
			locations: null,
			geocoding: null
		},
		popup: {
			mode: 'info',
			data: {

			}
		}, 
		clickedLocationPosition:null

	},

	mixins: [StoreMixins],

	init() {
		this.listenTo(LocationsGeoJson, this.updateLocations);
		this.listenTo(CountryGeo, this.updateCountry);

		/*LISTEN PROJECT STORE */
			//this.listenTo(projectStore, this.updateCountry);

			this.listenTo(Actions.get(Constants.ACTION_POPUP_INFO), 'updatePopupInfo');
			this.listenTo(Actions.get(Constants.ACTION_CODE_LOCATION), 'updatePopupDataEntry');

		},

		getInitialState() {
			return this.get();
		},

		updateLocations(data) {
			var newState = Object.assign({}, this.get())
			newState.layers.locations = data;
			this.setData(newState);
		},

		updateCountry(data) {
			var newState = Object.assign({}, this.get())
			newState.layers.country = data;
			this.setData(newState);

		},


		updatePopupDataEntry(params) {
			
			debugger;
			this.setData(Object.assign({},this.get(),{popup:{'position':params.position,location:null}}));

		},

		updatePopupInfo(params) {

			const {countryFeature, locationFeature, position} = params;
			if (!countryFeature) {
				console.log("COUNTRY INFO IS EMPTY .....")
			}
			/*Country properties*/
			const {CC_2, ENGTYPE_2, HASC_2, ID_0, ID_1, ID_2, ISO, NAME_0, NAME_1, NAME_2, NL_NAME_2, TYPE_2} = (countryFeature) ? countryFeature.properties: {}; //TODO: normalize field extraction
			
			/*Geonames properties*/
			const {fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryName, adminCode1, adminName1} = locationFeature.properties;
			
			const geocoding= this.makeGeocodingObject({NAME_0, NAME_1, NAME_2, fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName});
			/*creates info window parameters */
			this.setData(Object.assign({},this.get(),{popup:{'position':position,location:geocoding}}));
		},


		makeGeocodingObject(params){
			let model=

			 {
			
						'name': params.name,
						'id': params.geonameId,
						'activityDescription': '',
						
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
						'locationClass': null, //{code:''m,name:''}
						'exactness': null, // {{"code": "1", "name": "Exact"}
			}



			if (params.ID_0) {
				model = Object.assign(model, {
					'country': {
						code: params.ID_0,
						name: params.NAME_0
					}
				});
			}


			if (params.ID_1) {
				model = Object.assign(model, {
					'admin1': {
						code: params.ID_1,
						name: params.NAME_1
					}
				});
			}

			if (params.ID_2) {
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