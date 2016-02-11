import AjaxUtil from './AjaxUtil.es6';
//TODO: this can be moved to Settings;
let _mappings = [
	{'name': 'Mozambique', 'iso': 'MOZ', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/demo/shapes/MOZ.json'},
	{'name': 'Tanzania', 'iso': 'TZA', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/demo/shapes/TZA.json'},
	{'name': 'Malawi', 'iso': 'MWI', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/demo/shapes/MWI.json'},
	{'name': 'Zambia', 'iso': 'ZMB', 'url' :'https://raw.githubusercontent.com/devgateway/open-aid-geocoder/demo/shapes/ZMB.json'}



]

let util=AjaxUtil;

export default class ShapesMapping {

	static getGeoJsonShape (iso) {
		let url = _mappings.find(mapping => mapping.iso == iso).url;
		if (!url) {
			throw  `Can\'t find shape mapping for iso code ${iso}`
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
		return new Promise((resolve, reject) => {	
			resolve(_mappings);
		})
	}

}