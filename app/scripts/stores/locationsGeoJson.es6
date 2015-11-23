import {
	createStore
}
from 'reflux';
import {
	getAction
}
from '../actions/actions.es6';
import * as constans from '../constants/contants.es6';
import * as geoJson from '../util/geojson.es6';
import {
	List, Map, Record
}
from 'immutable';
import {
	StoreMixins
}
from '../mixins/storeMixins.es6';
import {
	LocationsStore
}
from './locations.es6'
import {
	GeoJsonBuilder
}
from '../util/geojson.es6';


const initialData = {};

const LocationsGeoJsonStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.listenTo(LocationsStore, this.process);
	},

	process(data) {
		let geojson=
		new GeoJsonBuilder({
			type: "Point",
			coordinates: function() {
				return [this.lng, this.lat]
			}
		}).build(data.get('records'));

		this.setData({geojson})
	}


});



export {
	LocationsGeoJsonStore
};