import React from 'react';
import {PropTypes} from 'react';
import GeoJsonLayer from './GeoJsonLayer.jsx';
export default class GeocodingLayer extends GeoJsonLayer {

  constructor() {
    super();
  }


  pointToLayer(feature, latlng) {
     let iconClass = feature.properties.status ? ' marker geocoding-marker-' + feature.properties.status.toLowerCase() : 'marker geocoding-marker-existing';
    if (iconClass == 'geocoding-marker-location') {
      iconClass = 'location-marker';
    }
    let icon = L.divIcon({
      iconSize: [30, 30],
      className: iconClass,
      html: `<div class='text'>${feature.properties.featureDesignation.code}</div>`
    });
    let marker = L.marker(latlng, {
      icon: icon
    });
    return marker
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.onFeatureClick.bind(this)
    });
  }

  onFeatureClick(e) {
    if (this.props.onFeatureClick) {
      this.props.onFeatureClick(e);
    }
  }

}