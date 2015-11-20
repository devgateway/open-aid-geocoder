import BaseClient from './baseClient.es6'

export default  class GeonamesClient extends BaseClient{
	constructor(options){
		super();
		this.options=options;
		this.url='http://api.geonames.org/search?'

	}

	parseQuery(params={}){
		return Object.assign(params,{'q':this.options.text,username:GEO_NAMES_SERVICE_USER_NAME,type:'json'})

	}

	paginate(params={}){
		return Object.assign(params, {startRow:0,maxRows:5})
	}

	parseResponse(response){
		debugger;
	}

} 

 
