import AjaxUtil from './AjaxUtil.es6';

let _mappings = [
	{'name': 'Tozambique', 'iso': 'MOZ', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/shapes/MOZ.json'},
	{'name': 'Tanzania', 'iso': 'TZA', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/master/shapes/TZA.json'}
]

let util=AjaxUtil;

export default class ShapesMapping {

	static getGeoJsonShape (iso) {
		let url = _mappings.find(mapping => mapping.iso == iso).url;
		if (!url) {
			throw "Can't find shape mapping for iso code ${iso}"
		} else {

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

	static getShapeList () {
		return _mappings;
	}

}