import {createStore} from 'reflux';
	import * as Constants from '../constants/Contants.es6';
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
		if(data.get('total') > 0) {
			let featureCollection=
			new GeoJsonBuilder({
				type: "Point",
				coordinates: function() {
					return [this.lng, this.lat]
				}
			}).build(data.get('records'));
			
			/*set data*/
			debugger;
			let newData=Object.assign(this.get(),{data:featureCollection,autoZoom:true});
			this.setData(newData);
		}
	},

	removeSavedLocation(location){
		debugger;
		let newGeoJson=Object.assign({},this.get())
		let filteredFeatures=newGeoJson.features.filter((it)=>{ if (it.properties.geonameId!=location.id){return it}})

		let newData=Object.assign(newGeoJson,{'features':filteredFeatures})

		this.setData(newData);
	}



});



export default	LocationsGeoJsonStore
