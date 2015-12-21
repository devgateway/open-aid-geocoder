import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

import LocationsGeoJson from './LocationsGeo.es6';
import CountryGeo from  './CountryGeo.es6';

const locationClassList= [{
				code: 1,
				name: 'Administrative Region',
				description: 'The designated geographic location is an administrative region (state, county, province, district, municipality etc.)'
			}, {
				code: 2,
				name: 'Populated Place',
				description: 'The designated geographic location is a populated place (town, village, farm etc.)'
			}, {
				code: 3,
				name: 'Structure',
				description: 'The designated geopgraphic location is a structure (such as a school or a clinic)'
			} ,{
				code: 4,
				name: 'Other Topographical Feature',
				description: 'The designated geographic location is a topographical feature, such as a mountain, a river, a forest'
			}

	];


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
			}
		},

		mixins: [StoreMixins],

		init() {
			this.listenTo(LocationsGeoJson, this.updateLocations);
			this.listenTo(CountryGeo, this.updateCountry);
		
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
			  let dataEntryInput= {
			  	locationClassList,
			  	'name': params.name, 
				'geonameId': params.geonameId, 
				'lat': params.lat,
				'lng': params.lng,
				'fcode': params.fcode, 
				'fcodeName': params.fcodeName,
				'toponymName': params.toponymName,
				'locationClass': params.locationClass,
				'exactness': params.exactness,
				'position': params.position,
				'admin0': params.NAME_0,
				'admin1': params.NAME_1, 
				'admin2': params.NAME_2}

			this.setData(Object.assign({},this.get(),{popup:{'mode':'dataEntry', 'position':params.position,content:dataEntryInput}}));

		},

		updatePopupInfo(params) {
			debugger;
			const {countryFeature, locationFeature, position} = params;
			if (!countryFeature) {
				console.log("COUNTRY INFO IS EMPTY .....")
			}
			const {CC_2, ENGTYPE_2, HASC_2, ID_0, ID_1, ID_2, ISO, NAME_0, NAME_1, NAME_2, NL_NAME_2, TYPE_2} = (countryFeature) ? countryFeature.properties: {}; //TODO: normalize field extraction
			const {fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName, countryName, adminCode1, adminName1} = locationFeature.properties;
			this.setData(Object.assign({},this.get(),{popup:{'mode':'info', 'position':position,content:{NAME_0, NAME_1, NAME_2, fclName, fcode, fcodeName, geonameId, lat, lng, name, toponymName}}}));
		}
});


export default PopUpStore;