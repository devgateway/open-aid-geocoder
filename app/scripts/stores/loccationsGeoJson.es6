import {createStore} from 'reflux';
import {getAction} from '../actions/actions.es6';
import * as constans from '../constants/contants.es6';
import * as geoJson from '../util/geojson.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/storeMixins.es6';

const initialData  = {features:[]};

const LocationsStore = createStore({

	initialData:initialData,
	mixins: [StoreMixins],

	init() {
		

	
	

});


export {LocationsStore};