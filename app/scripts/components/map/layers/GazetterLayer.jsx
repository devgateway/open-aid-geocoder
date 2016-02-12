
import React from 'react';
import { PropTypes } from 'react';
import GeoJsonLayer from './GeoJsonLayer.jsx';

export default class GazetteerLayer extends GeoJsonLayer {

  constructor() {
    super();
  }

  style() {
    //styles are applied by css for this layer 
  }

  pointToLayer(feature, latlng) {
    let  icon = L.divIcon({ iconSize: [30, 30], className: 'marker location-marker', html:`<div class="text">${feature.properties.fcode}</div>`}); //TODO:this  can be managed by a child view of the layer
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