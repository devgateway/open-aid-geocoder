import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';


const initialData  =new Map({total:0,records:new List(),types:new List()});

const LocationsStore = createStore({

	initialData:initialData,
	cachedData:null,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS), 'search');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS).completed, 'done');
		this.listenTo(Actions.get(Constants.ACTION_SEARCH_LOCATIONS).failed, 'failed');
		this.listenTo(Actions.get(Constants.ACTION_FILTER_BY_TYPE), 'filter');
		
	},

	getInitialState: function() {
		return this.get();
	},

	search() {
	},

	done(rawData) {
		if(rawData.totalResultsCount > 0) {
			
			let types=rawData.geonames.map( (a) =>{return {code:a.fcode,name:a.fcodeName}})  

			let uniqueTypes=types.filter((value, index, self) => {
				let valuefound=self.find(function(e){return e.code==value.code});
				return self.indexOf( valuefound) === index
				
			})


			this.setData(new Map({  total:rawData.totalResultsCount,
				records:this.inmutateResults(rawData.geonames),
				types:	this.inmutateResults(uniqueTypes)
			}));

			this.cachedData=this.get();
		}
		else {
			this.setData(initialData);
		}
	},

	inmutateResults(results){
		return new List(results);
	},

	failed() {
		console.log('failed');
	},

	filter(type){
		
		if (type!='ALL'){
			let map=this.cachedData;
			let list=map.get('records')
			var filteredList=list.filter((function(e){
				return e.fcode==type
			}));
			this.setData(new Map({total:map.get('total'),records:filteredList,types:	map.get('types')}));
		}else{
			this.setData(this.cachedData);
		}
	}

});


export default LocationsStore;