require('leaflet/dist/leaflet.css')

import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'; 
import {LocationsList} from '../locationsList.jsx'


class MapView extends React.Component {

  constructor() {
    super();
    this.state = {
      data: "",
      position:[51.505, -0.09],
      zoom:13
    }
  }

  componentDidMount() {
  
  }

  render() {
  return (
<div>
    <LocationsList/>
    <Map center={this.state.position} zoom={this.state.zoom}>
      <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            

      <Marker position={this.state.position}>
      <Popup>
        <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
      </Popup>
    </Marker>
  
  </Map>
     </div> )
  }
}

export { MapView }