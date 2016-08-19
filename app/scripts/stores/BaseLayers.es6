import L from 'leaflet';
import * as Providers from 'leaflet-providers';
import {createStore} from 'reflux';
import Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import * as Actions from '../actions/Actions.es6';

const initialData=
{
	'OpenStreetMap': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
	})
	,

	'OpenStreetMap German Style': L.tileLayer.provider('OpenStreetMap.DE'),

	'OpenStreetMap Black and White': L.tileLayer.provider('OpenStreetMap.BlackAndWhite'),

	'OpenStreetMap H.O.T.': L.tileLayer.provider('OpenStreetMap.HOT'),

	'Thunderforest OpenCycleMap': L.tileLayer.provider('Thunderforest.OpenCycleMap'),

	'Thunderforest Transport': L.tileLayer.provider('Thunderforest.Transport'),

	'Thunderforest Landscape': L.tileLayer.provider('Thunderforest.Landscape'),

	'Hydda Full': L.tileLayer.provider('Hydda.Full'),

	'MapQuest OSM': L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png', {
		subdomains: '1234',
		type: 'osm',
		attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />'
	}),

	'MapQuest Aerial': L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
		attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
		subdomains: '1234'
	}),

	'MapBox Example': L.tileLayer.provider('MapBox', {id: 'mapbox.streets', accessToken: 'pk.eyJ1IjoiZ3V0ZW55ZSIsImEiOiJmNjJlMDNmYTUyMzNjMzQxZmY4Mzc1ZmFiYmExNjMxOSJ9.xgl1PBwQV9CtwW-usedrcQ'}),

	'Stamen Toner': L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20
	}),

	'Stamen Watercolor': L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		subdomains: 'abcd',
		minZoom: 3,
		maxZoom: 16
	}),

	'Stamen Terrain': L.tileLayer.provider('Stamen.Terrain'),

	'Esri WorldStreetMap': L.tileLayer.provider('Esri.WorldStreetMap'),

	'Esri DeLorme': L.tileLayer.provider('Esri.DeLorme'),

	'Esri WorldTopoMap': L.tileLayer.provider('Esri.WorldTopoMap'),

	'Esri WorldImagery': L.tileLayer.provider('Esri.WorldImagery'),

	'Esri WorldTerrain': L.tileLayer.provider('Esri.WorldTerrain'),

	'Esri WorldShadedRelief': L.tileLayer.provider('Esri.WorldShadedRelief'),

	'Esri WorldPhysical': L.tileLayer.provider('Esri.WorldPhysical'),

	'Esri OceanBasemap': L.tileLayer.provider('Esri.OceanBasemap'),

	'Esri NatGeoWorldMap': L.tileLayer.provider('Esri.NatGeoWorldMap'),

	'Esri WorldGrayCanvas': L.tileLayer.provider('Esri.WorldGrayCanvas')
	
}


const BaseLayers = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.listenTo(Actions.get(Constants.ACTION_CLEAN_MAP_STORE), 'cleanStore');
	},

	cleanStore() {
		this.setData(this.initialData);
	}
});

export default	BaseLayers