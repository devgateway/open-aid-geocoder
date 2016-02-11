class FeatureCollection {
	/**
	 * [constructor description]
	 * @param  {Array}  features [description]
	 * @return {[type]}          [description]
	 */
	 constructor(features=[]) {
	 	Object.assign(this, {type: 'FeatureCollection',features});
	 }

	/**
	 * [addFeature description]
	 * @param {[type]} feature [description]
	 */
	 addFeature(feature){
	 	this.features.push(feature);
	 }
	}


	class Feature {
	/**
	 * [constructor description]
	 * @param  {[type]} geometry   [description]
	 * @param  {[type]} properties [description]
	 * @return {[type]}            [description]
	 */
	 constructor(geometry, properties) {
	 	Object.assign(this, {
	 		type: 'Feature',
	 		geometry: geometry,
	 		properties: properties
	 	});
	 }
	}

	class Geometry {
	/**
	 * [constructor description]
	 * @param  {[type]} type        [description]
	 * @param  {[type]} coordinates [description]
	 * @return {[type]}             [description]
	 */
	 constructor(type, coordinates) {
	 	Object.assign(this, {
	 		type: type,
	 		coordinates: coordinates
	 	});
	 }
	}


	class GeoJsonBuilder {
	/**
	 * [constructor description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	 constructor(options) {
	 	this.options = options;
	 }
	/**
	 * [build description]
	 * @param  {[type]} list [description]
	 * @return {[type]}      [description]
	 */
	 build(list) {
	 	if (!list || !list.forEach) {
	 		throw new Error('Object doesn\'t support property or method forEach');
	 	}

	 	let featureCollection = new FeatureCollection();
	 	
	 	list.forEach((record) => {
			let coordinates = this.options.coordinates.bind(record)(); // extract coordinates 
			featureCollection.addFeature(new Feature(new Geometry(this.options.type, coordinates), record)); //record is passed as properites in order to have al loriginal properties available 
		});

	 	return featureCollection;
	 }

	 

	}

	export {GeoJsonBuilder};