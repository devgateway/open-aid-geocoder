
class FeatureCollection {
	constructor(options) {
		this.type = 'FeatureCollection';
		this.features=[];
	}

	addFeature(feature){
		this.features.push(feature);
	}

	toJson(){

	}
}

class Feature {
	constructor(options) {
		this.type = 'Feature';
		this.geometry=options.geometries||{};
		this.properties={}
	}
}

class Point {
	constructor(options) {
		this.type = 'Point';
		this.coordinates = [];
	}
}


class GeometryCollection{
	constructor(options) {
		this.type = 'GeometryCollection';
		this.geometries = [];
	}
}

export {FeatureCollection,Feature,Point,GeometryCollection}