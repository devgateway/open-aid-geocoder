import BaseClient from './baseClient.es6'

export default  class GeonamesClient extends BaseClient{
	constructor(options){
		super();
		this.options=options;
		this.url='http://api.geonames.org/search?'

	}

	parseQuery(params={}){
		let result = Object.assign(params,{'q':this.options.text,username:GEO_NAMES_SERVICE_USER_NAME,type:'json'})
		if(this.options.country) {
			Object.assign(result, { 'country': this.options.countryISO })
		}
		if(this.options.fuzzy) {
			Object.assign(result, { 'fuzzy': window.FUZZY })
		}
		return result
	}

	paginate(params={}){
		return Object.assign(params, {startRow:0,maxRows:50})
	}

	parseResponse(response){
		
	}

} 

 
