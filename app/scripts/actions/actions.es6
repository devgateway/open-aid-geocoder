import {createActions,createAction} from 'reflux'
import * as Constants from '../constants/Contants.es6'
import GeonamesClient from '../util/gazetteers/GeonamesClient.es6'
import AjaxUtil from '../util/AjaxUtil.es6'
import getGeoJsonShape from '../util/ShapesMapping.es6'

let actionsDef={}

actionsDef[Constants.Search.ACTION_SEARCH_LOCATIONS]= { children: ["completed","failed"] }
actionsDef[Constants.Shapes.ACTION_LOAD_SHAPE]= { children: ["completed","failed"] }
//actionsDef[Constants.Shapes.ACTION_POPUP_INFO]= {}
//actionsDef[Constants.Shapes.ACTION_CODE_LOCATION]= {}

//TODO:Maybe we should iterate all action constans and initialize them 

/**
 * [actions description]
 * @type {[type]}
 */

const  actions= createActions(actionsDef);

/**
 * [description]
 * @param  {[type]} name    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
let invoke=(name,options)=>{
	if (!actions[name]){
		let a= createAction();
		actions[name]=a;
	}
	//call action
	actions[name](options);
}
/**
 * [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
let get=(name)=>{
	if (!actions[name]){
		let a= createAction();
		actions[name]=a;
	}
	return actions[name] 
} 	


/*Ajax calls for async actions */
actions[Constants.Search.ACTION_SEARCH_LOCATIONS].listen(function (options) {
	new GeonamesClient(options)
	.find().then((results)=> actions[Constants.Search.ACTION_SEARCH_LOCATIONS].completed(results))
	.catch((message)=>actions[Constants.Search.ACTION_SEARCH_LOCATIONS].failed(message));
})



/*Ajax calls for async actions */
actions[Constants.Shapes.ACTION_LOAD_SHAPE].listen(function (iso) {
		let url=getGeoJsonShape(iso)
		.then((results)=> actions[Constants.Shapes.ACTION_LOAD_SHAPE].completed(results))
		.catch((message)=>actions[Constants.Shapes.ACTION_LOAD_SHAPE].failed(message));
})


export  {get , invoke};
