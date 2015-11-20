import Axios from 'axios';

export default class BaseClient {
	constructor(options) {

	}

	get(url, params = {}) {
		return new Promise(
			function(resolve, reject) { // (A)
				Axios.get(url, {
						responseType: 'json',
						params: params
					})
					.then(function(response) {
						resolve(response);
					})
					.catch(function(response) {
						reject(response);
					});
			});
	}


	find(options) {
		return this.get(this.url, this.getParams()).then(this.results.bind(this))
	}

	/*This method should be imeplemented fro each service (geonames, esri geocoding, google geoco*/
	results(response) {
		return new Promise((resolve, reject) => {
			if (response.data && response.data.status && response.data.status.message) {
				reject(response.data.status.message);
			} else {
				resolve(response.data);
			}
		})
	}

	

	getParams() {
		return this.paginate(this.parseQuery());
	}



}