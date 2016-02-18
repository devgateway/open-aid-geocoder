//TODO: this file needs a big refactoring (TODO ADDED By @sdimunzio 31 01 2016)
import React from 'react';
import {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import {MapComponent, MapControl} from 'react-leaflet';
import {control}from 'leaflet'; 

import * as MiniMap from '../../../libs/mnimaps.es6';
import BaseLayerStore from '../../../stores/BaseLayers.es6';
import L from 'leaflet';

export default class  extends MapControl {


	constructor() {
		super();
		this.state =Object.assign({overlay:{} ,baseLayers:BaseLayerStore.get()});
	}


	componentDidMount() {		
		this.leafletElement = control.layers.minimap(this.state.baseLayers, this.state.overlay, {
			collapsed: true,
			overlayBackgroundLayer: this.state.baseLayers.OpenStreetMap
		}).addTo(this.props.map);
		
		this.map=this.props.map;

		this.state.baseLayers.OpenStreetMap.addTo(this.props.map);		
		this.initiated=true;

	}

	componentWillUnmount(){
		super.componentWillUnmount();
		this.leafletElement = null;
	}

	addLayer(layer,name,showAsMiniMap){	
		if (!this.initiated){
			let newState=Object.assign({},this.state);

			newState.overlay[name]={layer,showAsMiniMap};

			this.setState(newState)
		} else {
			if (this.leafletElement){
				this.leafletElement.addOverlay(layer, name,showAsMiniMap);
			}
		}
		this.props.map.addLayer(layer);
	}

	removeLayer(layer){
		this.props.map.removeLayer(layer);
		if (this.leafletElement){
			this.leafletElement.removeLayer(layer);
		}
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
		return (<div style={{display: 'none'}}>{children}</div>);
	}

	render(){
		return (this.renderChildrenWithProps({layerControl:this}));
	}


}
