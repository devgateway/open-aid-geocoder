import {createStore} from 'reflux';
import {getAction} from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import ProjectStore from './Project.es6';
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';


const initialData = {'geojson':null};

const ProjectGeoJsonStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.listenTo(ProjectStore, this.process);
	},

	process(data) {
		if (data.project.data.locations) {
			let featureCollection=
			new GeoJsonBuilder({
				type: "Point",
				coordinates: function() {
					return [this.geometry.coordinates[0], this.geometry.coordinates[1]]
				}
			}).build(data.project.data.locations);
			this.setData({'geojson':featureCollection});
		}
	}

});

export default	ProjectGeoJsonStore