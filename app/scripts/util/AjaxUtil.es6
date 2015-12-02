import Axios from 'axios';

export default class AjaxUtil {
	static get(url, params = {}) {
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



}