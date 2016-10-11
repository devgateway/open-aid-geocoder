import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import SingleProjectStore from './Project.es6';


const initialData  = {
		'locations': new Map({total:0,records:new List(),types:new List()}),
		'loadingLocations': false,
		'countryISO': null
	};

const LocationsStore = createStore({

	initialData:initialData,
	cachedData:null,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(SingleProjectStore, this.updateCountryISO);
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS), 'search');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS).completed, 'done');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS).failed, 'failed');
		this.listenTo(Actions.get(Constants.ACTION_FILTER_BY_TYPE), 'filter');
		this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');
	},

	cleanStore() {		 
    	this.setData(this.initialData);
	},

	getInitialState: function() {
		return this.get();
	},

	search() {
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'loadingLocations': true});
		this.setData(newState);
	},

	updateCountryISO(project){
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {countryISO: project.country ? project.country.iso2 : null});
		this.setData(newState);
	},

	done(rawData) {
		var newState = Object.assign({}, this.get());
		if(rawData.totalResultsCount > 0) {
			let types=rawData.geonames.map( (a) =>{return {code:a.fcode,name:a.fcodeName}})  
			let uniqueTypes=types.filter((value, index, self) => {
				let valuefound=self.find(function(e){return e.code==value.code});
				return self.indexOf( valuefound) === index				
			})
			let locations = new Map({  total:rawData.totalResultsCount,
				records:this.inmutateResults(rawData.geonames),
				types:	this.inmutateResults(uniqueTypes)
			});
			Object.assign(newState, {'locations': locations, 'loadingLocations': false});
			this.cachedData = locations;
		}
		else {
			Object.assign(newState, {'locations': initialData.locations, 'loadingLocations': false});
		}
		this.setData(newState);
	},

	inmutateResults(results){
		return new List(results);
	},

	failed() {
		console.log('failed');
	},

	filter(type){
		var newState = Object.assign({}, this.get());
		if (type!='ALL'){
			let map = this.cachedData;
			let list = map.get('records')
			var filteredList=list.filter((function(e){
				return e.fcode==type
			}));
			let locations = new Map({total:map.get('total'),records:filteredList,types: map.get('types')});
			Object.assign(newState, {'locations': locations});
		} else {
			Object.assign(newState, {'locations': this.cachedData});
		}
		this.setData(newState);
	}

});


export default LocationsStore;