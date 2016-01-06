import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import CountryLayersStore from './CountryLayersStore.es6';
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';

const initialData = {countryShapes: []};
const ShapesStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE), 'loading');		
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE).completed, 'completed');
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SHAPE).failed, 'failed');
		this.listenTo(CountryLayersStore, this.process);
	},


	loading(){
		console.log('Loading country shape')
	},

	completed(shape, iso){
		var newState = Object.assign({}, this.get());
		if (!newState.countryShapes.find((it) => {return it.iso===iso})){
			var data = {iso: iso, shape: shape};
			newState.countryShapes.push(data);
			this.setData(newState);
			this.process({shapeList: newState.shapeList});
			console.log('Country shape was loaded ');
		}
	},

	failed(message){
		console.error(`Ups got  ${message}`)
	},

	process(data) {
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'shapeList': data.shapeList});		
		let layersVisible = data.shapeList.find((it) => {return it.added == true && it.visible == true}) || [];
		var features = [];
		if (newState.countryShapes.length > 0){
			if (layersVisible.map){
				features = features.concat(
					layersVisible.map((layer) => {
						return newState.countryShapes.find((it) => {return it.iso===layer.iso}).shape.features;
		        	})
		        ); 
			} else {
				features = newState.countryShapes.find((it) => {return it.iso===layersVisible.iso}).shape.features;
			}
		}
		Object.assign(newState, {countryLayer: {'type': 'FeatureCollection', 'features': features}});
        this.setData(newState);       
	}
});



export default ShapesStore;