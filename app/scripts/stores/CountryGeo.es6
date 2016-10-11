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
	    this.listenTo(Actions.get(Constants.ACTION_UNLOAD_SHAPE), 'remove');
		this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');		
	},

	cleanStore() {
		this.setData(this.initialData);
	},

	loading(){
		debugger;
		//TODO:activate loading spiner 
		console.log('Loading country shape')
	},

	completed(data, iso){	
		var newState = Object.assign({}, this.get());
		if (!newState.countries.find((it) => {return it.iso===iso})){
			var countryLayer = {data , iso, autoZoom:true,visible:true, key:iso,style: {radius: 8,fillColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),color: '#000',weight: 1,opacity: 1,fillOpacity: 0.8}}; //set all layer metadata here
			newState.countries.push(countryLayer)
			this.setData(newState);
			Actions.invoke(Constants.ACTION_COUNTRY_LAYER_ADDED_TO_MAP,iso);
		}
	},

	remove(iso){
		var newState = Object.assign({}, this.get());
			let countries=newState.countries.filter((it)=>{return it.iso!=iso});
			newState=Object.assign(newState,{countries:countries});
			this.setData(newState);
			Actions.invoke(Constants.ACTION_COUNTRY_LAYER_REMOVED_FROM_MAP,iso);
	},


	failed(message){
		console.error(`Ups got  ${message}`);
	}

});



export default ShapesStore;