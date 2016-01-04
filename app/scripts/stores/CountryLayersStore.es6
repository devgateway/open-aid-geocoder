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
		this.setData({shapeList: list});
		if (this.data.layerToAdd){
			this.addLayer(this.data.layerToAdd);
		}
		console.log('Country shapes were loaded ');
	},

	addLayer(countryISO){
		if (this.data.shapeList.length==0){
	    	this.setData({layerToAdd: countryISO});
	    	return;
	    }
	    var layers = this.data.shapeList;
	    var layerToAdd = layers.find((it) => {return it.iso===countryISO});
	    Object.assign(layerToAdd, {added: true});//add it
	    Object.assign(layerToAdd, {visible: true});//make it visible
	    this.setData({shapeList: layers});
	    Actions.invoke(Constants.ACTION_LOAD_SHAPE, countryISO);
	},

	toggleLayerVisibility(data){
		var layers = this.data.shapeList;
	    var layerToUpdate = layers.find((it) => {return it.iso===data.iso});
	    Object.assign(layerToUpdate, {visible: data.visible});//update visibility
	    this.setData({shapeList: layers});
	},
});



export default CountryLayersStore;