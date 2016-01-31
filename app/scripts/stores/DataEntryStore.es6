import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = {};
const DataEntryStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_OPEN_DATAENTRY_POPUP), 'openPopup');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID).completed, 'updateData');
		this.listenTo(Actions.get(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES).completed, 'updateAdminData');
	},

	openPopup(location){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'location': location});//set the location to be used
		Object.assign(newState, {'showPopup': true});//open the popup
		this.setData(newState);
	},

	updateAdminData(location){
		var newState = Object.assign({}, this.get());
		var newAdminData = {
			'country': {
				code: location.countryId,
				name: location.countryName
			},
			'admin1': {
				code: location.adminId1,
				name: location.adminName1
			},
			'admin2': {
				code: location.adminId2,
				name: location.adminName2
			}
		}
		Object.assign(newState.location.adminCodes.geonames, newAdminData);//set the new data from Geonames
		Object.assign(newState, {'loadingAdminGeonames': false});
		this.setData(newState);
	},

	updateData(location){
		var newState = Object.assign({}, this.get());
		var newData = {
			'name': location.name,
			'toponymName': location.toponymName,
			'featureDesignation': {
				code: location.fcode,
				name: location.fcodeName
			}
		}
		Object.assign(newState.location, newData);//set the new data from Geonames
		var newAdminData = {
			'country': {
				code: location.countryId,
				name: location.countryName
			},
			'admin1': {
				code: location.adminId1,
				name: location.adminName1
			},
			'admin2': {
				code: location.adminId2,
				name: location.adminName2
			}
		}
		Object.assign(newState.location.adminCodes.geonames, newAdminData);//set the new data from Geonames
		Object.assign(newState, {'loadingGeonames': false});
		this.setData(newState);
	}
});



export default DataEntryStore;