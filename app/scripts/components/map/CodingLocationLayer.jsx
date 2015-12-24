
import React from 'react';
import { Children, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as Constants from '../../constants/Contants.es6';
import DynamicGeoJson from './DynamicGeoJson.jsx';
import { Map, popup } from 'leaflet';
import Popup from './PopUp.jsx';

export default class LocationsLayer extends DynamicGeoJson {

    constructor() {
      super();
    }

    style() {
      return {
        radius: 8,
        fillColor: "#CC6666",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }

    highlightStyle() {
      return {
        radius: 10,
        fillColor: "#CC6666",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      };
    }


    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, this.style());
    }

    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature.bind(this),
        mouseout: this.resetHighlight.bind(this),
        click: this.onFeatureClick.bind(this)
      });
    }

    resetHighlight(e) {
      var layer = e.target;
      var feature = e.target.feature;
      layer.setStyle(this.style());
    }


    onFeatureClick(e) {
      const {data, map, ...props} = this.props;
      const position = e.latlng
      const {geometry, properties} = e.target.feature;
      

     /* const extraData=(this.props.queryFeatures)?this.props.queryFeatures(e):null;
      const fulldata={extraData,properties}  
      //set state will rener the popoup
      
      this.setState({fulldata, geometry, position})
    */
      this.props.onFeatureClick?this.props.onFeatureClick(e):null;
    }


    highlightFeature(e) {
      var layer = e.target;
      var feature = e.target.feature;
      layer.setStyle(this.highlightStyle());
      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }
    }

    /*
    render() {
      super.render()
      const children = this.getClonedChildrenWithMap(this.state || {});
      return <div style ={{display: 'none'}}> {children} </div>;
    }*/

  }