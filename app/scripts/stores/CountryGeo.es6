import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import CountryLayersStore from './CountryLayersStore.es6';
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';

const initialData = {countries:[]};  //a country object is like {iso:MOZ data:geojson}
const ShapesStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE), 'loading');		
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE).completed, 'completed');
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE).failed, 'failed');
		
	},


	loading(){
		console.log('Loading country shape')
	},

	completed(data, iso){

		var newState = Object.assign({}, this.get());

		if (!newState.countries.find((it) => {return it.iso===iso})){
			var countryLayer = {data,iso,autoZoom:true,visible:true}; //set all layer metadata here
			newState.countries.push(countryLayer)
			this.setData(newState);
		}
	},

	failed(message){
		console.error(`Ups got  ${message}`)
	}
	
});



export default ShapesStore;