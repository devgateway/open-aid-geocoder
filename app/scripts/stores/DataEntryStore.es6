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
		this.listenTo(Actions.get(Constants.ACTION_CLOSE_DATAENTRY_POPUP), 'closePopup');
		this.listenTo(Actions.get(Constants.ACTION_CHANGE_CODING_VALUE), 'valueChanged');
		this.listenTo(Actions.get(Constants.ACTION_PREPARE_SAVE_LOCATION), 'saveLocation');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID), 'loadingData');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID).completed, 'updateData');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID).failed, 'geonamesFailed');
		this.listenTo(Actions.get(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES), 'loadingAdminData');
		this.listenTo(Actions.get(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES).completed, 'updateAdminData');
		this.listenTo(Actions.get(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES).failed, 'geonamesFailed');		
	},

	closePopup(){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'showPopup': false, 'error': null});
		this.setData(newState);
	},

	openPopup(location){
		var newState = Object.assign({}, this.get());
		let adminSource = location.adminSource || (location.type=='geocoding'? 'saved' : location.adminCodes.shape? 'shape' : 'geonames');		
		//adminSource if it is not set, it will be set by default to:
		// 'saved' if it is an already coded location
		// 'shape' if it is a new location and have values from shapes
		// 'geonames' if it is a new location and it doesn't have values from shapes
		Object.assign(location, {'adminSource': adminSource});
		Object.assign(newState, {'geocoding': location});//set the location to be used
		Object.assign(newState, {'showPopup': true});//open the popup
		if (location.adminSource=='geonames'){
	      Actions.invoke(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES, {'geonameID': newState.geocoding.id});
	    }
	    this.setData(newState);
	},

	valueChanged(newValue){
		var newState = Object.assign({}, this.get());
		var newGeocoding = Object.assign({}, newState.geocoding);
		var val = {};
		val[newValue.name] = newValue.value;
		Object.assign(newGeocoding, val);
		Object.assign(newState, {'geocoding': newGeocoding});
		this.setData(newState);
	},

	loadingAdminData(){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'loadingAdminGeonames': true});
		this.setData(newState);
	},

	loadingData(){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'loadingGeonames': true});
		this.setData(newState);
	},

	saveLocation(){
		var newState = Object.assign({}, this.get());
		let geocoding = this.buildGecoding(newState.geocoding);
		let prev_status = geocoding.status;
		let status = geocoding.type == 'location' ? 'NEW' : newState.geocoding.confirmDelete=='CONFIRMED' ? 'DELETED' : 'UPDATED';
		if (prev_status == 'NEW' && status == 'DELETED') {
			status = 'LOCATION';
		}
		if (prev_status == 'NEW' && status == 'UPDATED') {
			status = 'NEW';
		}
		let saveGeo = Object.assign({}, geocoding);
		Object.assign(saveGeo, {'status': status});
		Actions.invoke(Constants.ACTION_SAVE_LOCATION, saveGeo);
	},

	/**
     * Create final geocoding object 
     * @return {[type]} [description]
     */
    buildGecoding(source) {
		var newGeocoding={};
		Object.assign(newGeocoding, {
			name: source.name,
			'id': source.id,
			'geometry': source.geometry,
			'description':source.description,
			'featureDesignation': source.featureDesignation,
			'type': source.type,
			'status': source.status,
			'activityDescription':source.activityDescription,
			'locationClass':source.locationClass,
			'exactness':source.exactness,
			'adminSource': source.adminSource
		});
		Object.assign(newGeocoding, {
	        'country': source.adminCodes[source.adminSource].country,
	        'admin1': source.adminCodes[source.adminSource].admin1,
	        'admin2': source.adminCodes[source.adminSource].admin2,
	    }); 
		return newGeocoding;
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
		Object.assign(newState.geocoding.adminCodes.geonames, newAdminData);//set the new data from Geonames
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
		Object.assign(newState.geocoding, newData);//set the new data from Geonames
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
		Object.assign(newState.geocoding.adminCodes.geonames, newAdminData);//set the new data from Geonames
		Object.assign(newState, {'loadingGeonames': false});
		this.setData(newState);
	},

	geonamesFailed(error){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {error, 'loadingGeonames': false, 'loadingAdminGeonames': false});
		this.setData(newState);
	}
});



export default DataEntryStore;