import React from 'react';
import { Children, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Map, popup } from 'leaflet';
import { MapComponent,Popup } from 'react-leaflet';
import {Button} from 'react-bootstrap';


export default class MapPopUp extends Popup {


	componentDidMount() {
		//nothing to do on mount it will should be showed after updating propereties
	}

	componentDidUpdate(prevProps) {
		const {open,position,map} = this.props;
		
		if (open) {
			this.leafletElement.setLatLng(position);
			this.leafletElement.openOn(map)
		

		}else{
			map.closePopup();
		}

		if (this.leafletElement._isOpen) {
			this.renderPopupContent();
		}


	}

	renderPopupContent() {

		if (this.props.children) {
			render(
				React.cloneElement(Children.only(this.props.children), this.props) ,
				this.leafletElement._contentNode
			);
			console.log(this.leafletElement._contentNode.offsetWidth)

			this.leafletElement._updateLayout();
			this.leafletElement._updatePosition();
			this.leafletElement._adjustPan();
		} else {
			this.removePopupContent();
		}
	}
}