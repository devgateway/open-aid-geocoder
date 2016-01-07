import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = {shapeList: []};
const CountryLayersStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST).completed, 'loadLayerList');		
		this.listenTo(Actions.get(Constants.ACTION_ADD_COUNTRY_LAYER), 'addLayer');
		this.listenTo(Actions.get(Constants.ACTION_TOGGLE_LAYER_VISIBILITY), 'toggleLayerVisibility');
	},

	
	loadLayerList(list){
		var newState = Object.assign({}, this.get());
		
		Object.assign(newState, {shapeList: list});
		
		this.setData(newState);
		
		console.log('Country shapes were loaded ');
	},



	addLayer(countryISO){
		var newState = Object.assign({}, this.get());
		var selectedLayer = newState.shapeList.find((it) => {return it.iso===countryISO});
	    Object.assign(selectedLayer, {'added': true,'visible': true});//add it
	    this.setData(newState);

	    Actions.invoke(Constants.ACTION_LOAD_SHAPE, countryISO);
	
	},

	toggleLayerVisibility(data){/*
		var newState = Object.assign({}, this.get());
		var layers = newState.shapeList;
	    var layerToUpdate = layers.find((it) => {return it.iso===data.iso});
	    Object.assign(layerToUpdate, {visible: data.visible});//update visibility
	    Object.assign(newState, {'shapeList': layers});
	    this.setData(newState);
	    */
	},
});



export default CountryLayersStore;