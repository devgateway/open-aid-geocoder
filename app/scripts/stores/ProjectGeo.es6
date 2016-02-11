import {createStore} from 'reflux';
import {getAction} from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
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

	process(project) {
		let newData;
		if (project.locations) {
			let featureCollection=
			new GeoJsonBuilder({
				type: 'Point',
				coordinates: function() {
					return [this.geometry.coordinates[0], this.geometry.coordinates[1]]
				}
			}).build(project.locations);
			featureCollection.features.forEach((record) => {
				let rollbackData = project.locationsBackup? project.locationsBackup.find((it)=>{return it.id==record.properties.id}) : null;
				Object.assign(record.properties, {'rollbackData': rollbackData});//duplicates the values into same object for rollback purposes
			});
			newData=Object.assign(this.get(),{data:featureCollection,autoZoom:false, date:new Date()});
		} else {
			newData=Object.assign(this.get(),{data:null,autoZoom:false,date:new Date()});
		}

		this.setData(newData);
	}

});

export default	ProjectGeoJsonStore