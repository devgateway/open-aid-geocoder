import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = {};
const SingleProjectStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT), 'loading');		
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT).completed, 'completed');
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT).failed, 'failed');
		this.listenTo(Actions.get(Constants.ACTION_SAVE_LOCATION),'addGeocoding')
	},

	loading(){
		console.log('Loading project...')
	},

	completed(response){
		this.setData(response.data); 
	},

	failed(message){
		console.error(`Error loading project: ${message}`)
	},
	

	addGeocoding(geocoding){
		let project=this.get();
		let newState=Object.assign({},project);
		let locations=newState.locations || []
			locations.push(geocoding);

		Object.assign(newState,{locations:locations});

		this.setData(newState)
		
	}

});



export default SingleProjectStore;