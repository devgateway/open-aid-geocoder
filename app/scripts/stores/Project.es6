import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import _ from 'lodash'; //TODO: rewview if we can use an es6 method instead of lodash

const initialData = {};
const SingleProjectStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		
		console.log(Constants.ACTION_LOAD_SINGLE_PROJECT);
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT), 'loading');		
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT).completed, 'completed');
		this.listenTo(Actions.get(Constants.ACTION_LOAD_SINGLE_PROJECT).failed, 'failed');
		this.listenTo(Actions.get(Constants.ACTION_SAVE_LOCATION),'addGeocoding');
		this.listenTo(Actions.get(Constants.ACTION_SUBMIT_GEOCODING),'submitGeocoding');
		this.listenTo(Actions.get(Constants.ACTION_SAVE_PROJECT), 'loading');		
		this.listenTo(Actions.get(Constants.ACTION_SAVE_PROJECT).completed, 'saveSuccess');
		this.listenTo(Actions.get(Constants.ACTION_SAVE_PROJECT).failed, 'failed');
		this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');
	},

	cleanStore() {
		 
    	this.setData(this.initialData);
	},

	loading(){
		console.log('Loading project...')
	},

	completed(response){
		let project=response.data;
		if (project.country){
			Actions.invoke(Constants.ACTION_LOAD_SHAPE,project.country.iso3)
		}
		this.setData(project); 
	},

	failed(message){
		console.error(`Error loading project: ${message}`)
	},
	

	addGeocoding(geocoding){
		let project=this.get();
		let newState=Object.assign({},project);
		let locations=newState.locations || [];
		Object.assign(geocoding, {'type': 'geocoding'});//set type to geocoding to indentify those locations coded
		var locGeo = locations.find((it) => {return it.id===geocoding.id});
		if (locGeo){
			Object.assign(locGeo, geocoding);
		} else {
			locations.push(geocoding);
		}		
		Object.assign(newState,{'locations':locations});
		this.setData(newState);
		
	},

	submitGeocoding(geocoding){
		let project=this.get();
		let newState=Object.assign({},project);
		let locations=newState.locations || [];
		let locNotDeleted = locations.filter((it) => {return it.status!='DELETED'});
		let locNoStatus = []
		locNotDeleted.map((it) => {locNoStatus.push(_.omit(it, 'status'));});
		Object.assign(newState,{'locations': locNoStatus});
		this.setData(newState);
		Actions.invoke(Constants.ACTION_SAVE_PROJECT, newState);		
	},


	saveSuccess(){
		window.history.back();
    	window.location.reload();
	}
});



export default SingleProjectStore;