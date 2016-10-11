import AjaxUtil from './AjaxUtil.es6';
import Settings from './Settings.es6';

let settings=Settings.getInstace();

let util=AjaxUtil;

export default class ShapesMapping {

	static getGeoJsonShape (iso) {
		debugger;
		let url = settings.get('SHAPES', 'LIST').find(mapping => mapping.iso == iso).url;
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
			resolve(settings.get('SHAPES', 'LIST'));
		})
	}

}