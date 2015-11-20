import {createActions} from 'reflux';
import * as constants from '../constants/contants.es6'
import GgeonamesClient from '../util/gazetteers/geonamesClient.es6'


let actionsDef={}

actionsDef[constants.ACTION_SEARCH_LOCATIONS]= { children: ["completed","failed"] }

let  actions= createActions(actionsDef);



let actionsCaller=(name,options)=>{
	actions[name](options);
}

let getAction=(name)=>{
	return actions[name] 
} 	

actions[constants.ACTION_SEARCH_LOCATIONS].listen(function (options) {
	new GgeonamesClient(options)
	.find().then((results)=> actions[constants.ACTION_SEARCH_LOCATIONS].completed(results))
	.catch((message)=>actions[constants.ACTION_SEARCH_LOCATIONS].failed(message));
})


export  {actionsCaller,getAction};
