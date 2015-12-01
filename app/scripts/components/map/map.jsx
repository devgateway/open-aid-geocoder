require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap';
import { Map, Marker, Popup, TileLayer  } from 'react-leaflet'; 
import {LocationsList} from '../LocationsList.jsx';
import {LocationsGeoJsonStore} from '../../stores/LocationsGeoJson.es6';
import {ShapesStore} from '../../stores/ShapesStore.es6';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

import LocationsLayer  from './LocationsLayer.jsx';
import CountryLayer from './CountryLayer.jsx';

class MapView extends React.Component {

  constructor() {
    super();
    this.state = {data: [],position: [0.0, 0.0],zoom: 3}
  }

  componentDidMount() {
    /*Set listeners*/
    LocationsGeoJsonStore.listen(this.onLocationsUpdated.bind(this));
    ShapesStore.listen(this.onShapeUpdated.bind(this));

    /*Invoke initial actions*/
    Actions.invoke(Constants.Shapes.ACTION_LOAD_SHAPE,'MOZ') ///Country shape should be loaded after loading project information

  }

  componentWillUnmount() {
    /*Remove listeners*/
    LocationsGeoJsonStore.unlisten(this.onLocationsUpdated.bind(this));
    ShapesStore.unlisten(this.onShapeUpdated.bind(this));
  }

  /*Handle updates of country shapes*/
  onShapeUpdated(data){
      this.setState(Object.assign(this.state, {shape: data.shape}))
  }

  /*Habdle updates of locations*/
  onLocationsUpdated(data) {
    this.setState(Object.assign(this.state, {locations: data.geojson}))
  }


  render() {
    return (
      <div>
        <LocationsList/>
          <Map center={this.state.position} zoom={this.state.zoom}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <LocationsLayer data={this.state.locations} autoZoom={true}/>
          <CountryLayer data={this.state.shape} autoZoom={true}/>
        </Map>
      </div> )
  }
}

export { MapView }
