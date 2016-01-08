
import React from 'react';
import { Children, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as Constants from '../../constants/Contants.es6';
import DynamicGeoJson from './DynamicGeoJson.jsx';
import { Map, popup } from 'leaflet';
import Popup from './PopUp.jsx';

/**
 * 
 */
export default class CountryLayer extends DynamicGeoJson {

  constructor() {
     super();
  }

  /**
   * [style description]
   * @return {[type]} [description]
   */
  style() {
    return this.props.style;
  }

  /**
   * [highlightStyle description]
   * @return {[type]} [description]
   */
  highlightStyle() {
    return {
      radius: 10,
      fillColor: "#e6ba73",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  /**
   * [onEachFeature description]
   * @param  {[type]} feature [description]
   * @param  {[type]} layer   [description]
   * @return {[type]}         [description]
   */
  onEachFeature(feature, layer) { 
    
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this)});
  }

  /**
   * [resetHighlight description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  resetHighlight(e) {
    
    var layer = e.target;
    var feature = e.target.feature;
    layer.setStyle(this.style());
  }


  /**
   * [highlightFeature description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  highlightFeature(e) {
    var layer = e.target;
    var feature = e.target.feature;
    layer.setStyle(this.highlightStyle());
    if (!L.Browser.ie && !L.Browser.opera) {
     // layer.bringToFront();
    }

  }
}