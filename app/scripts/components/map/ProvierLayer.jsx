import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

import {MapLayer} from 'react-leaflet'; 

import * as Providers from 'leaflet-providers'; 


export default class ProviderLayer extends MapLayer {


	componentWillMount() {
		
		  //L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

		this.leafletElement=L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		this.leafletElement.addTo(this.props.map)
	}	

	render(){
		return (<div/>);
	}
}
