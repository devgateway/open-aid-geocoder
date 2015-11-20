import {createStore} from 'reflux';
import {getAction} from '../actions/actions.es6';
import * as constans from '../constants/contants.es6';
import * as geoJson from '../util/geojson.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/storeMixins.es6';


const initialData  = {total:0,records:new List()};

const LocationsStore = createStore({

	initialData:initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(getAction(constans.ACTION_SEARCH_LOCATIONS), 'search');
		this.listenTo(getAction(constans.ACTION_SEARCH_LOCATIONS).completed, 'done');
		this.listenTo(getAction(constans.ACTION_SEARCH_LOCATIONS).failed, 'failed');
	},

	

	
	getInitialState: function() {
		return this.get();
	},

	
	search() {
		console.log('search');
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