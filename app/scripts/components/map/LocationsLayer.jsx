require('leaflet/dist/leaflet.css')

import React from 'react';
import * as Constants from '../../constants/Contants.es6';
import { PropTypes } from 'react';
import DynamicGeoJson from './DynamicGeoJson.jsx';


export default class LocationsLayer extends DynamicGeoJson {

  constructor() {
    super();
    
  }

  style(){
    return { radius: 8,fillColor: "#CC6666",color: "#000",weight: 1,opacity: 1,fillOpacity: 0.8 };
  }

  highlightStyle(){
    return { radius: 10,fillColor: "#CC6666",color: "#000",weight: 2,opacity: 1,fillOpacity: 0.8 };
  }

  
  pointToLayer(feature, latlng){
    return L.circleMarker(latlng, this.style());
  }

  onEachFeature(feature, layer) {
    layer.on({ mouseover: this.highlightFeature.bind(this), mouseout: this.resetHighlight.bind(this), click: this.onFeatureClick.bind(this)});
  }

  resetHighlight(e) {
    var layer = e.target;
    var feature = e.target.feature;
    layer.setStyle(this.style());
  }

  onFeatureClick(e) {
    var feature = e.target.feature;
  }

  highlightFeature(e) {
    debugger;
    var layer = e.target;
    var feature = e.target.feature;
    
    layer.setStyle(this.highlightStyle());
    
    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
    this.info.update(layer.feature.properties);
  }



}