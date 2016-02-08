import React from 'react';
import { Children, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Map, popup } from 'leaflet';
import { Popup } from 'react-leaflet';

export default class MapPopUp extends Popup {

	componentDidUpdate(prevProps) {
		
		const {open,position,map} = this.props;
		
		if (open) {
			this.leafletElement.setLatLng(position);
			this.leafletElement.openOn(map);


		}else{
			map.closePopup();
		}

		if (this.leafletElement._isOpen) {
			this.renderPopupContent();
		}
	}

	componentDidMount(){
		/*keep this method empty*/
	};

	renderPopupContent() {
				
		if (this.props.children) {
			render(
				React.cloneElement(Children.only(this.props.children), this.props) ,
				this.leafletElement._contentNode
				);
			console.log(this.leafletElement._contentNode.offsetWidth);

			this.leafletElement._updateLayout();
			this.leafletElement._updatePosition();
			this.leafletElement._adjustPan();
		} else {
			this.removePopupContent();
		}
	}
}