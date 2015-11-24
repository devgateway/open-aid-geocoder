require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap';
import { Map, Marker, Popup, TileLayer  } from 'react-leaflet'; 
import {LocationsList} from '../LocationsList.jsx';
import {Path} from 'react-leaflet'
import { geoJson } from 'leaflet';
import {LocationsGeoJsonStore} from '../../stores/LocationsGeoJson.es6';

class DynamicGeoJson extends Path {
  constructor() {
    debugger;
    super();
  }

  static propTypes = {
    // data: PropTypes.object.isRequired,
  };

  componentWillMount() {
    super.componentWillMount();
    const {data, map, ...props} = this.props;
    this.leafletElement = geoJson(data, props);
  }



  componentDidUpdate(prevProps) {

    if (this.props.data != prevProps.data) { //we should do a better work to detect data changes 
      const {data, map, ...props} = this.props;
      (this.props.layerGroup || this.props.map).removeLayer(this.leafletElement);
      this.leafletElement = geoJson(data, props);
      (this.props.layerGroup || this.props.map).addLayer(this.leafletElement);
      map.fitBounds(this.leafletElement.getBounds())
    }

    this.setStyleIfChanged(prevProps, this.props);
  }


}

class MapView extends React.Component {

  constructor() {
    super();
    this.state = {data: [],position: [0.0, 0.0],zoom: 3}
  }

  componentDidMount() {
    LocationsGeoJsonStore.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    LocationsGeoJsonStore.unlisten(this.onStoreChange.bind(this));
  }

  onStoreChange(data) {
    this.setState(Object.assign(this.state, {locations: data.geojson}))
  }

  render() {
    return (
      <div>
        <LocationsList/>
          <Map center={this.state.position} zoom={this.state.zoom}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <DynamicGeoJson data={this.state.locations}/>
        </Map>
      </div> )
  }
}

export { MapView }