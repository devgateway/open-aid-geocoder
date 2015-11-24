import {createActions} from 'reflux';
import * as Constants from '../constants/Contants.es6'
import GgeonamesClient from '../util/gazetteers/GeonamesClient.es6'


let actionsDef={}

actionsDef[Constants.Search.ACTION_SEARCH_LOCATIONS]= { children: ["completed","failed"] }

let  actions= createActions(actionsDef);



let invoke=(name,options)=>{
	actions[name](options);
}

let get=(name)=>{
	return actions[name] 
} 	

actions[Constants.Search.ACTION_SEARCH_LOCATIONS].listen(function (options) {
	new GgeonamesClient(options)
	.find().then((results)=> actions[Constants.Search.ACTION_SEARCH_LOCATIONS].completed(results))
	.catch((message)=>actions[Constants.Search.ACTION_SEARCH_LOCATIONS].failed(message));
})


export  {get,invoke};
