import React from 'react';
import {PropTypes} from 'react';
import {MapLayer} from 'react-leaflet'; 
import { featureGroup } from 'leaflet';

export default class LayerGroup extends MapLayer {
	componentWillMount() {
		super.componentWillMount();
		this.leafletElement = featureGroup();
		//this.props.layerControl.addLayer(this.leafletElement ,this.props.name,this.props.showInMinimaps);

	}

	render() {
		return this.renderChildrenWithProps({
			layerGroup: this.leafletElement,
		});
	}
}