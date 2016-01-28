import BaseClient from './baseClient.es6'

export default  class GeonamesClient extends BaseClient{
	constructor(options){
		super();
		this.options=options;
		this.searchURL='http://api.geonames.org/search?';
		this.getURL='http://api.geonames.org/getJSON?';
	}

	parseQuery(params={}){
		let result = {username:GEO_NAMES_SERVICE_USER_NAME,type:'json'};
		if (this.options.text){
			Object.assign(result, {'q':this.options.text}); 
		}
		if (this.options.geonameID){
			Object.assign(result, {'geonameId':this.options.geonameID}); 
		}
		if(this.options.country) {
			Object.assign(result, { 'country': this.options.countryISO })
		}
		if(this.options.fuzzy) {
			Object.assign(result, { 'fuzzy': window.FUZZY })
		}
		return result
	}

	paginate(params={}){
		return Object.assign(params, {startRow:0,maxRows:100,style:'full',orderby:'relevance',lang:'en'})
	}

	parseResponse(response){
		
	}

} 

 