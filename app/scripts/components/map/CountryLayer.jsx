require('leaflet/dist/leaflet.css')

import React from 'react';
import * as Constants from '../../constants/Contants.es6';
import { PropTypes } from 'react';
import DynamicGeoJson from './DynamicGeoJson.jsx';


export default class CountryLayer extends React.Component {

  constructor() {
    super();
  }

  onEachFeature(feature,layer){
    layer.bindPopup(this.popup(feature));
  }

  //Shape poup TODO://Fill with useful information 
  popup(feature){ 
    return `
    <div class="panel panel-success">
        <div class="panel-body">
          <div> ISO:${feature.properties.ISO} </div>
          <div>Country: ${feature.properties.NAME_0} </div>
          <div>1st : ${feature.properties.NAME_1} </div>
          <div>2nd : ${feature.properties.NAME_2} </div>
          <div>Type: ${feature.properties.TYPE_2} </div>
        </div>
      </div>`
  }

  style(){
    return  {
      "color": "#ff7800",
      "weight": 1,
      "opacity": 0.65
    }
  }


  render() {
    return <DynamicGeoJson {...this.props} onEachFeature={this.onEachFeature.bind(this)} style={this.style}/>
  }
}