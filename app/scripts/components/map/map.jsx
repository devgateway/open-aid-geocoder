require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

import {Popup, Map, Marker, TileLayer,ZoomControl} from 'react-leaflet'; 

import leafletPip from 'leaflet-pip';

import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

import CodingLocationLayer from './CodingLocationLayer.jsx';
import LocationsLayer  from './LocationsLayer.jsx';
import CountryLayer from './CountryLayer.jsx';

import MapPopUp from './PopUp.jsx';
import DataEntry from  './DataEntry.jsx';
import LocationPopup from './LocationPopup.jsx'; 
import MapStore from '../../stores/Map.es6';

/**
 * 
 */
class MapView extends React.Component {

  constructor() {
    super();
    this.state = MapStore.get();
  }

  componentDidMount() {
    Actions.invoke(Constants.ACTION_LOAD_SHAPE,'MOZ') ///Country shape should be loaded after loading project information
    this.unsubscribe=MapStore.listen(this.onMapUpdated.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  onMapUpdated(data) {
    this.setState(data);
  }

  /*
    This is called by location onClick 
  */
  locationClick(e){  
    //e.targer.feature 
    //using geonames lat and lng instead of event latlng should be more precise.
    let countryInfo=this.queryFeatures(e.latlng,this.refs.countries.leafletElement);
    let locationFeature=e.target.feature
    let countryFeature=(countryInfo && countryInfo.length >0)?countryInfo[0].feature:null;
    const {latlng}=e;
    //at this stage I have the location feature + country feature 
    Actions.invoke(Constants.ACTION_POPUP_INFO,{ locationFeature, countryFeature, 'position':latlng}) ///Country shape should be loaded after loading project information
  }
 
  /*Query features behind the point*/
  queryFeatures(latlng,layer){
   return leafletPip.pointInLayer(latlng, layer);
  }
 


  render() {
      return (
          <div>
            <Map {...this.state.map} ref="map">
              <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <LocationsLayer onFeatureClick={this.locationClick.bind(this)}  data={this.state.layers.locations}  autoZoom={true}></LocationsLayer>
                <CountryLayer data={this.state.layers.country} autoZoom={true}  ref="countries"/>  
                <CodingLocationLayer onFeatureClick={this.locationClick.bind(this)}  data={this.state.geocoding} autoZoom={true}></CodingLocationLayer>                
                <MapPopUp maxWidth="850" {...this.state.popup}><LocationPopup/></MapPopUp>
              </Map>
            </div>
        )
        }
}

export default MapView;