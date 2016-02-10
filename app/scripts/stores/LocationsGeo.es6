import {createStore} from 'reflux';
	import Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import LocationsStore from './Locations.es6';
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';
import * as Actions from '../actions/Actions.es6';


const initialData = {
	autoZoom:true,
	data:{}
};

const LocationsGeoJsonStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.listenTo(LocationsStore, this.process);
		this.listenTo(Actions.get(Constants.ACTION_SAVE_LOCATION),'removeSavedLocation')
	},

	process(data) {
		
		if(data.locations.get('total') > 0) {
			let featureCollection=
			new GeoJsonBuilder({
				type: 'Point',
				coordinates: function() {
					return [this.lng, this.lat]
				}
			}).build(data.locations.get('records'));
			let newData=Object.assign(this.get(),{data: featureCollection, autoZoom: true});
			this.setData(newData);
		} else {
			this.setData({});
		}
	},

	removeSavedLocation(location){		
		let newState=Object.assign({},this.get())
		let newGeoJson=newState.data;
		let filteredFeatures=newGeoJson.features.filter((it)=>{ if (it.properties.geonameId!=location.id){return it}})
		newGeoJson=Object.assign(newGeoJson,{'features': filteredFeatures})
		newState=Object.assign(newState,{data: newGeoJson, autoZoom: false});
		this.setData(newState);
	}
});

export default	LocationsGeoJsonStore
