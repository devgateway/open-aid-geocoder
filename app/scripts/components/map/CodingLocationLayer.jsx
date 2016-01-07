
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
 
    }


  pointToLayer(feature, latlng) {
      let  icon = L.divIcon({iconSize: [30, 30],className: 'geocoding-marker',html:`<div class="text">${feature.properties.featureDesignation.code}</div>`});
      let marker= L.marker(latlng,  {icon: icon});
      return marker
    }

    onEachFeature(feature, layer) {
      layer.on({
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


    /*
    render() {
      super.render()
      const children = this.getClonedChildrenWithMap(this.state || {});
      return <div style ={{display: 'none'}}> {children} </div>;
    }*/

  }