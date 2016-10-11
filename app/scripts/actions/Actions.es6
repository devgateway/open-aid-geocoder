import {createActions, createAction} from 'reflux'

import Constants from '../constants/Contants.es6'
import Geonames from '../util/gazetteers/Geonames.es6'
import AjaxUtil from '../util/AjaxUtil.es6'
import APIClient from '../util/APIClient.es6'

import ShapesMapping from '../util/ShapesMapping.es6'

let actionsDef = {}

actionsDef[Constants.ACTION_SEARCH_LOCATIONS] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_UPDATE_ADM_FROM_GEONAMES] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_LOAD_SHAPE] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_FIND_PROJECTS] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_LOAD_SINGLE_PROJECT] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_LOAD_COUNTRY_LAYER_LIST] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_ADD_COUNTRY_LAYER] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_TOGGLE_LAYER_VISIBILITY] = {
	children: ['completed', 'failed']
}
actionsDef[Constants.ACTION_SAVE_PROJECT] = {
	children: ['completed', 'failed']
}



actionsDef[Constants.ACTION_UPLOAD_FILE] = {
	children: ['completed', 'failed']
}


actionsDef[Constants.ACTION_SET_FILE];



/*create async actions*/
const actions = createActions(actionsDef);



/**
 * Call  action by name
 * @param  String name    [description]
 * @param  Object options [description]
 */
let invoke = (name, options) => {
	if (!actions[name]) {
		let a = createAction();
		actions[name] = a;
	}
	actions[name](options);
}

/**
 * Get action by name 
 * @param  String name [description]
 * @return {[type]}      [description]
 */
let get = (name) => {
	if (!actions[name]) {
		let a = createAction();
		actions[name] = a;
	}
	return actions[name]
}


/*Ajax calls for async actions */
actions[Constants.ACTION_SEARCH_LOCATIONS].listen(function(options) {
	new Geonames(options)
		.find().then((results) => actions[Constants.ACTION_SEARCH_LOCATIONS].completed(results))
		.catch((message) => actions[Constants.ACTION_SEARCH_LOCATIONS].failed(message));
})

actions[Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID].listen(function(options) {
	new Geonames(options)
		.findByGeonameID().then((results) => actions[Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID].completed(results))
		.catch((message) => actions[Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID].failed(message));
})

actions[Constants.ACTION_UPDATE_ADM_FROM_GEONAMES].listen(function(options) {
	new Geonames(options)
		.findByGeonameID().then((results) => actions[Constants.ACTION_UPDATE_ADM_FROM_GEONAMES].completed(results))
		.catch((message) => actions[Constants.ACTION_UPDATE_ADM_FROM_GEONAMES].failed(message));
})


/*Ajax calls for async actions */
actions[Constants.ACTION_LOAD_SHAPE].listen(function(iso) {
	
	ShapesMapping.getGeoJsonShape(iso).then((results) => actions[Constants.ACTION_LOAD_SHAPE].completed(results, iso))
		.catch((message) => actions[Constants.ACTION_LOAD_SHAPE].failed(message));
})

/* Load  projects asynchronously */
actions[Constants.ACTION_FIND_PROJECTS].listen(function(params) {
	APIClient.getProjectList(params)
		.then((results) => actions[Constants.ACTION_FIND_PROJECTS].completed(results))
		.catch((message) => actions[Constants.ACTION_FIND_PROJECTS].failed(message));
})

actions[Constants.ACTION_LOAD_SINGLE_PROJECT].listen(function(id) {
	APIClient.getProject(id)
		.then((results) => actions[Constants.ACTION_LOAD_SINGLE_PROJECT].completed(results))
		.catch((message) => actions[Constants.ACTION_LOAD_SINGLE_PROJECT].failed(message));
})

actions[Constants.ACTION_SAVE_PROJECT].listen(function(project) {
	APIClient.saveProject(project)
		.then((results) => actions[Constants.ACTION_SAVE_PROJECT].completed(results))
		.catch((message) => actions[Constants.ACTION_SAVE_PROJECT].failed(message));
})

actions[Constants.ACTION_LOAD_COUNTRY_LAYER_LIST].listen(function() {
	ShapesMapping.getShapeList().then((results) => actions[Constants.ACTION_LOAD_COUNTRY_LAYER_LIST].completed(results))
		.catch((message) => actions[Constants.ACTION_LOAD_COUNTRY_LAYER_LIST].failed(message));
})

actions[Constants.ACTION_UPLOAD_FILE].listen(function(file) {
	debugger;
	APIClient.upload(file)	
		.then((results) => {
			debugger;
			actions[Constants.ACTION_UPLOAD_FILE].completed(results)
		})
		.catch((message) =>{
			debugger
			 actions[Constants.ACTION_UPLOAD_FILE].failed(message)
		});
})



export {
	get, invoke
};