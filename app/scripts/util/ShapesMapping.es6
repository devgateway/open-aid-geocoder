import AjaxUtil from './AjaxUtil.es6';

let _mappings = {
	"MOZ": 'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/shapes/MOZ.json'
}

let util=AjaxUtil;

/**
 * [description]
 * @param  {[type]} iso [description]
 * @return {[type]}     [description]
 */
let getGeoJsonShape = (iso) => {
	if (!_mappings[iso]) {
		throw "Can't find shape mapping for iso code ${iso}"
	} else {

		let url = _mappings[iso];

		return new Promise((resolve, reject) => {
			AjaxUtil.get(url)
				.then((response) => {
					resolve(response.data);
				})
				.catch((response) => {
					reject( `got ${response.status}  ${response.statusText}`)
				})
		})
	}
}

export default getGeoJsonShape