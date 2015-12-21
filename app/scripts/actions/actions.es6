import {createActions, createAction} from 'reflux'

import Constants from '../constants/Contants.es6'
import GeonamesClient from '../util/gazetteers/GeonamesClient.es6'
import AjaxUtil from '../util/AjaxUtil.es6'
import APIClient from '../util/APIClient.es6'

import getGeoJsonShape from '../util/ShapesMapping.es6'

let actionsDef = {}

actionsDef[Constants.ACTION_SEARCH_LOCATIONS] = {
	children: ["completed", "failed"]
}
actionsDef[Constants.ACTION_LOAD_SHAPE] = {
	children: ["completed", "failed"]
}
actionsDef[Constants.ACTION_LOAD_ALL_PROJECTS] = {
	children: ["completed", "failed"]
}
actionsDef[Constants.ACTION_LOAD_SINGLE_PROJECT] = {
	children: ["completed", "failed"]
}

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
	new GeonamesClient(options)
		.find().then((results) => actions[Constants.ACTION_SEARCH_LOCATIONS].completed(results))
		.catch((message) => actions[Constants.ACTION_SEARCH_LOCATIONS].failed(message));
})



/*Ajax calls for async actions */
actions[Constants.ACTION_LOAD_SHAPE].listen(function(iso) {
	getGeoJsonShape(iso).then((results) => actions[Constants.ACTION_LOAD_SHAPE].completed(results))
		.catch((message) => actions[Constants.ACTION_LOAD_SHAPE].failed(message));
})

/* Load  projects asynchronously */
actions[Constants.ACTION_LOAD_ALL_PROJECTS].listen(function() {
	APIClient.getProjectList()
		.then((results) => actions[Constants.ACTION_LOAD_ALL_PROJECTS].completed(results))
		.catch((message) => actions[Constants.ACTION_LOAD_ALL_PROJECTS].failed(message));
})

actions[Constants.ACTION_LOAD_SINGLE_PROJECT].listen(function(id) {
	APIClient.getProject(id)
		.then((results) => actions[Constants.ACTION_LOAD_SINGLE_PROJECT].completed(results))
		.catch((message) => actions[Constants.ACTION_LOAD_SINGLE_PROJECT].failed(message));
})


export {
	get, invoke
};