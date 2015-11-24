import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';


const initialData  = {total:0,records:new List()};

const LocationsStore = createStore({

	initialData:initialData,
	mixins: [StoreMixins],

	init() {
		
		this.data=initialData;
		this.listenTo(Actions.get(Constants.Search.ACTION_SEARCH_LOCATIONS), 'search');
		this.listenTo(Actions.get(Constants.Search.ACTION_SEARCH_LOCATIONS).completed, 'done');
		this.listenTo(Actions.get(Constants.Search.ACTION_SEARCH_LOCATIONS).failed, 'failed');
	},

	

	
	getInitialState: function() {
		return this.get();
	},

	
	search() {
	},

	done(rawData) {
		this.setData(new Map({total:rawData.totalResultsCount,records:this.inmutateResults(rawData.geonames)}));
	},

	inmutateResults(results){
		return new List(results);
	},

	failed() {
		console.log('failed');
	}

});


export {LocationsStore};