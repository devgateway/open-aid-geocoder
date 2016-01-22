import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

import {MapComponent} from 'react-leaflet'; 

import * as Providers from 'leaflet-providers'; 

import  * as leafletImage from 'leaflet-image'
require('leaflet.sync');



var cloneLayer = require('leaflet-clonelayer');


L.Control.Layers.Minimap = L.Control.Layers.extend({
	options: {
		position: 'topright',
		topPadding: 10,
		bottomPadding: 40,
		overlayBackgroundLayer: L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
			attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>' +
			' &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		})
	},

	filter: function (string) {
		string = string.trim();

		var visibleLayers = {};
		var layerLabels = this._container.querySelectorAll('label');
		for (var i = 0; i < layerLabels.length; i++) {
			var layerLabel = layerLabels[i];

			if (string !== '' && layerLabel._layerName.indexOf(string) === -1) {
				L.DomUtil.addClass(layerLabel, 'leaflet-minimap-hidden');
			} else {
				L.DomUtil.removeClass(layerLabel, 'leaflet-minimap-hidden');
				visibleLayers[layerLabel._layerName] = cloneLayer(layerLabel._minimap._layer);
			}
		}
		this._onListScroll();

		return visibleLayers;
	},

	isCollapsed: function () {
		return !L.DomUtil.hasClass(this._container, 'leaflet-control-layers-expanded');
	},

	_expand: function () {
		L.Control.Layers.prototype._expand.call(this);
		this._onListScroll();
	},

	

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		container = this._container = L.DomUtil.create('div', className);

		//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
			.disableClickPropagation(container)
			.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, 'click', this._expand, this)
				//.on(container, 'mouseout', this._collapse, this);
			}
			var link = this._layersLink = L.DomUtil.create('div', className + '-toggle', container);
			link.title = 'Layers';

			if (L.Browser.touch) {
				
				L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', this._expand, this);
			}
			else {
				L.DomEvent.on(link, 'click', this._expand, this);
			}
			//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
			L.DomEvent.on(form, 'click', function () {
				setTimeout(L.bind(this._onInputClick, this), 0);
			}, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		var title = L.DomUtil.create('div', 'leaflet-minimap-title', form);
		title.innerHTML = ' Overlays' 

		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);

		var title = L.DomUtil.create('div', 'leaflet-minimap-title', form);
		title.innerHTML = ' Base Layers' 

		
		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);

		container.appendChild(form);

		L.DomUtil.addClass(this._container, 'leaflet-control-layers-minimap');
		L.DomEvent.on(this._container, 'scroll', this._onListScroll, this);

	},



	_onInputClick: function (e) {
		

		var i, input, obj,
		inputs = this._form.getElementsByTagName('input'),
		inputsLen = inputs.length;

		this._handlingClick = true;

		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			obj = this._layers[input.layerId];

			if (input.checked && !this._map.hasLayer(obj.layer)) {
				this._map.addLayer(obj.layer);

			} else if (!input.checked && this._map.hasLayer(obj.layer)) {
				this._map.removeLayer(obj.layer);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();

	},

	_update: function () {
		L.Control.Layers.prototype._update.call(this);

		this._map.on('resize', this._onResize, this);
		this._onResize();

		this._map.whenReady(this._onListScroll, this);
	},


	addOverlay: function (layer, name,showInMinimaps) {
		this._addLayer(layer, name, true,showInMinimaps);
		this._update();
		return this;
	},

	_addLayer: function (layer, name, overlay,showInMinimaps) {
		
		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay,
			showInMinimaps:showInMinimaps
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},


	_addItem: function (obj) {

		if (obj.showInMinimaps!=false){
			this._addMiniMap(obj)

		}else{
			this._addLayerControl(obj)
		}


	},


	_addMiniMap:function(obj){
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		var label = L.DomUtil.create('label', 'leaflet-minimap-container', container);
		label._layerName = obj.name;
		var checked = this._map.hasLayer(obj.layer);

		label._minimap = this._createMinimap(
			L.DomUtil.create('div', 'leaflet-minimap', label),
			obj.layer,
			obj.overlay
			);


		var span = L.DomUtil.create('span', 'leaflet-minimap-label', label);

		var input;
		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}


		input.layerId = L.stamp(obj.layer);
		span.appendChild(input);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		//L.DomEvent.on(label, 'click', this._onInputClick, this);

		var name = L.DomUtil.create('span', '', span);
		name.innerHTML = ' ' + obj.name;

		return label;
	},


	_addLayerControl:function(obj){
	
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
	
		var label = L.DomUtil.create('label', 'leaflet-minilayer-container');

		 container.insertBefore(label,container.firstChild )
		label._layerName = obj.name;

		var checked = this._map.hasLayer(obj.layer);


		var span = L.DomUtil.create('div', 'leaflet-minimap-label', label);

		var comment = L.DomUtil.create('div', 'leaflet-minilayer-comment', label);
			comment.innerHTML="(Preview no available)";
		var input;
		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}


		input.layerId = L.stamp(obj.layer);
		span.appendChild(input);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		
		var name = L.DomUtil.create('span', '', span);
		name.innerHTML = ' ' + obj.name;

		return label;
	},

	_onResize: function () {
		var mapHeight = this._map.getContainer().clientHeight;
		var controlHeight = this._container.clientHeight;

		if (controlHeight > mapHeight - this.options.bottomPadding) {
			this._container.style.overflowY = 'scroll';
		}
		this._container.style.maxHeight = (mapHeight - this.options.bottomPadding - this.options.topPadding) + 'px';
	},

	_onListScroll: function () {
		
		var minimaps = document.querySelectorAll('label[class="leaflet-minimap-container"]');
		if (minimaps.length === 0) {
			return;
		}

		var first, last;
		if (this.isCollapsed()) {
			first = last = -1;
		} else {
			var minimapHeight = minimaps.item(0).clientHeight;
			var container = this._container;
			var listHeight = container.clientHeight;
			var scrollTop = container.scrollTop;

			var firstRow = Math.floor(scrollTop / minimapHeight);
			var lastRow = Math.ceil((scrollTop + listHeight) / minimapHeight);
			var mapsPerRow=Math.floor(container.clientWidth  / minimaps.item(0).clientWidth)
			 first= firstRow * mapsPerRow //(3 number of map in row)
			 last=lastRow * mapsPerRow //(3 number of map in row)
			 console.log(first+'-----'+last);
		}

		for (var i = 0; i < minimaps.length; ++i) {
			var minimap = minimaps[i].childNodes.item(0);
			var map = minimap._miniMap;
			if(map){
				var layer = map._layer;

				if (!layer) {
					continue;
				}

				if (i >= first && i <= last) {
					if (!map.hasLayer(layer)) {
						layer.addTo(map);
					}
					map.invalidateSize();
				} else if (map.hasLayer(layer)) {
					map.removeLayer(layer);
				}
			}
		}
	},



	_createMinimap: function (mapContainer, originalLayer, isOverlay) {

		var minimap = mapContainer._miniMap = L.map(mapContainer, {
			attributionControl: false,
			zoomControl: false
		});

		// disable interaction.
		minimap.dragging.disable();
		minimap.touchZoom.disable();
		minimap.doubleClickZoom.disable();
		minimap.scrollWheelZoom.disable();

		// create tilelayer, but do not add it to the map yet.
		if (isOverlay && this.options.overlayBackgroundLayer) {
			// add a background for overlays if a background layer is defined.
			minimap._layer = L.layerGroup([
				cloneLayer(this.options.overlayBackgroundLayer),
				cloneLayer(originalLayer)
				]);
		} else {
			minimap._layer = cloneLayer(originalLayer);
		}

		var map = this._map;

		map.whenReady(function () {
			
			minimap.setView(map.getCenter(), map.getZoom());
			map.sync(minimap);


		});

		return minimap;
	}
});

L.control.layers.minimap = function (baseLayers, overlays, options) {
	return new L.Control.Layers.Minimap(baseLayers, overlays, options);
};




export default class MiniMap extends React.Component {

	constructor() {
		super();
		
	}


	componentWillMount() {
			/*TODO maybe this should not be here*/
		var baselayers = {
			'OpenStreetMap': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}),
			'OpenStreetMap German Style': L.tileLayer.provider('OpenStreetMap.DE'),

			'OpenStreetMap Black and White': L.tileLayer.provider('OpenStreetMap.BlackAndWhite'),
			
			'OpenStreetMap H.O.T.': L.tileLayer.provider('OpenStreetMap.HOT'),
			
			'Thunderforest OpenCycleMap': L.tileLayer.provider('Thunderforest.OpenCycleMap'),
			
			'Thunderforest Transport': L.tileLayer.provider('Thunderforest.Transport'),
			
			'Thunderforest Landscape': L.tileLayer.provider('Thunderforest.Landscape'),
			
			'Hydda Full': L.tileLayer.provider('Hydda.Full'),
			
			'MapQuest OSM': L.tileLayer.provider('MapQuestOpen.OSM'),
			
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
			
		};

		this.layersControl = L.control.layers.minimap(baselayers, null,{collapsed:true,overlayBackgroundLayer:baselayers.OpenStreetMap}).addTo(this.props.map);

		var filter = function () {
			var hash = window.location.hash;
			var filterIndex = hash.indexOf('filter=');
			if (filterIndex !== -1) {
				var filterString = hash.substr(filterIndex + 7).trim();
				this.layersControl.filter(filterString);
			}
		};

		baselayers.OpenStreetMap.addTo(this.props.map);

		L.DomEvent.on(window, 'hashchange', filter);
		
		filter();

		
	}	


	addLayer(layer,name,showInMinimaps){
		
		this.props.map.addLayer(layer);
		this.layersControl.addOverlay(layer,name,showInMinimaps);	
	}

	removeLayer(layer){
		
		this.props.map.removeLayer(layer);
		this.layersControl.removeLayer(layer);
	}

	getClonedChildrenWithMap(extra) {
		const { children, map } = this.props;
		const props = Object.assign({map}, extra);

		return React.Children.map(children, child => {
			return child ? React.cloneElement(child, props) : null;
		});
	}

	renderChildrenWithProps(props) {
		const children = this.getClonedChildrenWithMap(props);
		return <div style={{display: 'none'}}>{children}</div>;
	}

	render(){
		
		return (this.renderChildrenWithProps({layerControl:this}));
	}

}
