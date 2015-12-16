import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = { projects: [] };
const ProjectStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.Project.ACTION_LOAD_ALL_PROJECTS), 'loading');		
		this.listenTo(Actions.get(Constants.Project.ACTION_LOAD_ALL_PROJECTS).completed, 'completed');
		this.listenTo(Actions.get(Constants.Project.ACTION_LOAD_ALL_PROJECTS).failed, 'failed');
	},


	loading(){
		console.log('Loading all projects...')
	},

	completed(projects){
		this.setData({ "projects": projects });
	},

	failed(message){
		console.error(`Error loading projects: ${message}`)
	}

});



export default ProjectStore;