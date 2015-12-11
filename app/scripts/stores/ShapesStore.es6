import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import LocationsStore from './Locations.es6'
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';

const initialData = {};
const ShapesStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.Shapes.ACTION_LOAD_SHAPE), 'loading');		
		this.listenTo(Actions.get(Constants.Shapes.ACTION_LOAD_SHAPE).completed, 'completed');
		this.listenTo(Actions.get(Constants.Shapes.ACTION_LOAD_SHAPE).failed, 'failed');
	},


	loading(){
		console.log('Loading country shape')
	},

	completed(shape){
		this.setData({ shape })
		console.log('Country shape was loaded ');
	},


	failed(message){
		console.error(`Ups got  ${message}`)
	}

});



export default ShapesStore;