import {createStore} from 'reflux';
import ProjectStore from './Project.es6'
import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import {GeoJsonBuilder} from '../util/GeojsonBuilder.es6';


const locationClassList= [{
				code: 1,
				name: 'Administrative Region',
				description: 'The designated geographic location is an administrative region (state, county, province, district, municipality etc.)'
			}, {
				code: 2,
				name: 'Populated Place',
				description: 'The designated geographic location is a populated place (town, village, farm etc.)'
			}, {
				code: 3,
				name: 'Structure',
				description: 'The designated geopgraphic location is a structure (such as a school or a clinic)'
			} ,{
				code: 4,
				name: 'Other Topographical Feature',
				description: 'The designated geographic location is a topographical feature, such as a mountain, a river, a forest'
			}

	];

const initialData  = {locationClassList};

/*This store should be renamed to geocoding and should actually manage the state of teh coding data 
whic*/
const PopUpStore = createStore({

	initialData:initialData,
	mixins: [StoreMixins],
	//this can be sotred in a json file or maybe
	init() {
			this.listenTo(ProjectStore, this.process);
			this.listenTo(Actions.get(Constants.ACTION_CODE_LOCATION), 'codeLocation');
			this.listenTo(Actions.get(Constants.ACTION_SAVE_CODED_LOCATION), 'saveCodedLocation');
			this.listenTo(Actions.get(Constants.ACTION_DELETE_CODED_LOCATION), 'deleteCodedLocation');
	},

	getInitialState(){
		return this.get();
	},

	process(data) {
		if (data.project.data.locations) {
			let featureCollection=
			new GeoJsonBuilder({
				type: "Point",
				coordinates: function() {
					return [this.loc_point.lon, this.loc_point.lat]
				}
			}).build(data.project.data.locations);
			this.setData({'geojson':featureCollection});
		}
	},

	codeLocation(params){
		this.setData({
			locationClassList,
				'name': params.name, 
				'geonameId': params.geonameId, 
				'lat': params.lat,
				'lng': params.lng,
				'fcode': params.fcode, 
				'fcodeName': params.fcodeName,
				'toponymName': params.toponymName,
				'locationClass': params.locationClass,
				'exactness': params.exactness,
				'position': params.position,
				'admin0': params.NAME_0,
				'admin1': params.NAME_1, 
				'admin2': params.NAME_2
		})
	},




	editGeocodinglocation(){},

	saveCodedLocation(){},

	prepare(){},


});


export default PopUpStore;