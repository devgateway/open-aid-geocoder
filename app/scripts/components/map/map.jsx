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
import {ShapesStore} from '../../stores/ShapesStore.es6';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

class DynamicGeoJson extends Path {
  constructor() {
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
    const {data, map, ...props} = this.props;
    if (this.props.data != prevProps.data) { //we should do a better work to detect data changes 
      let parent = (this.props.layerGroup || this.props.map)
      parent.removeLayer(this.leafletElement);
      this.leafletElement = geoJson(data, props);
      parent.addLayer(this.leafletElement);
      if (props.autoZoom) {
        map.fitBounds(this.leafletElement)
      }
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
    LocationsGeoJsonStore.listen(this.onLocationsUpdated.bind(this));
    
    ShapesStore.listen(this.onShapeUpdated.bind(this));

    Actions.invoke(Constants.Shapes.ACTION_LOAD_SHAPE,'MOZ') ///Country shape should be loaded after loading project information

  }

  componentWillUnmount() {
    LocationsGeoJsonStore.unlisten(this.onLocationsUpdated.bind(this));
  }

  onShapeUpdated(data){
      debugger;
      this.setState(Object.assign(this.state, {shape: data.shape}))
  }

  onLocationsUpdated(data) {
    this.setState(Object.assign(this.state, {locations: data.geojson}))
  }

  render() {
    return (
      <div>
        <LocationsList/>
          <Map center={this.state.position} zoom={this.state.zoom}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <DynamicGeoJson data={this.state.locations} autoZoom={true}/>
          <DynamicGeoJson data={this.state.shape} autoZoom={true}/>
        </Map>
      </div> )
  }
}

export { MapView }