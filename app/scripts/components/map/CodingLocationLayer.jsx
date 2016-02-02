
import React from 'react';
import { Children, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import Constants from '../../constants/Contants.es6';
import DynamicGeoJson from './DynamicGeoJson.jsx';
import { Map, popup } from 'leaflet';
import Popup from './PopUp.jsx';

export default class CodingLocationLayer extends DynamicGeoJson {

  constructor() {
    super();
  }

  
  pointToLayer(feature, latlng) {
    
    let iconClass = feature.properties.status ? "geocoding-marker-" + feature.properties.status.toLowerCase() : "geocoding-marker-existing";
    if(iconClass == "geocoding-marker-location") {
      iconClass = "location-marker";
    }
    let  icon = L.divIcon({iconSize: [30, 30],className: iconClass, html:`<div class="text">${feature.properties.featureDesignation.code}</div>`});
    let marker= L.marker(latlng,  {icon: icon});
    return marker
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.onFeatureClick.bind(this)
    });
  }

  onFeatureClick(e) {
    const {data, map, ...props} = this.props;
    const position = e.latlng
    const {geometry, properties} = e.target.feature;
    this.props.onFeatureClick?this.props.onFeatureClick(e):null;
  }



}