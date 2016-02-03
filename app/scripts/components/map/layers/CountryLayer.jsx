
import React from 'react';
import { PropTypes } from 'react';
import GeoJsonLayer from './GeoJsonLayer.jsx';

 export default class CountryLayer extends GeoJsonLayer {

   constructor() {
     super();
   }

   /**
    Set feature style
    */
   style() {
     return this.props.style;
   }

   /*
    set feature hlightStyle
    */
   highlightStyle() {
     return this.props.hlightStyle;
   }


   highlightFeature(e) {
     var layer = e.target;
     var feature = e.target.feature;
     layer.setStyle(this.highlightStyle());
     /*if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }*/
   }

 /*Set feature events*/
 onEachFeature(feature, layer) {
   layer.on({
     mouseover: this.highlightFeature.bind(this),
     mouseout: this.resetHighlight.bind(this)
   });
 }

 /*Return to original style*/
 resetHighlight(e) {
   var layer = e.target;
   var feature = e.target.feature;
   layer.setStyle(this.style());
 }


 }