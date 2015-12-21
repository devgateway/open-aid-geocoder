import {createStore} from 'reflux';
import {getAction} from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import LocationsStore from './Locations.es6'
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';


const initialData = {'geojson':null};

const LocationsGeoJsonStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.listenTo(LocationsStore, this.process);
	},

	process(data) {
		let featureCollection=
		new GeoJsonBuilder({
			type: "Point",
			coordinates: function() {
				return [this.lng, this.lat]
			}
		}).build(data.get('records'));

		this.setData(featureCollection)
	}


});



export default	LocationsGeoJsonStore
