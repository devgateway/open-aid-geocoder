import React from 'react';
import ReactDOM from 'react';
import { PropTypes } from 'react';

import {L, Popup, Map, Marker, TileLayer,ZoomControl,MapLayer,ScaleControl} from 'react-leaflet'; 
import leafletPip from 'leaflet-pip';

import * as Actions from '../../actions/Actions.es6';
import Constants from '../../constants/Contants.es6';

/*Layer*/
import LayerGroup from './layers/LayerGroup.jsx';
import GeocodingLayer from './layers/GeocodingLayer.jsx';
import GazetterLayer  from './layers/GazetterLayer.jsx';
import CountryLayer from './layers/CountryLayer.jsx';

/*Controls*/
import Control from './controls/Control.jsx'; //control container

import ActionButtons from './controls/ActionButtons.jsx';
import MiniMap from './controls/MiniMap.jsx';
import CountrySelector from './controls/CountrySelector.jsx'
import InfoPanel from './controls/InfoPanel.jsx';

/*Popups*/
import MapPopUp from './popups/PopUp.jsx';
import LocationPopup from './popups/LocationPopup.jsx'; 

/*Dialogs*/
import DataEntryPopup from '../dialogs/DataEntry.jsx';

/*Store*/
import MapStore from '../../stores/Map.es6';


 const MapSize=React.createClass({
   componentDidMount(){
   
   },

  render(){
     return null;
  }
 });

export default class MapView extends React.Component {

  constructor() {
    super();
    this.state = MapStore.get();
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = MapStore.listen(this.onMapUpdated.bind(this));
  }

  componentWillUnmount() {
    Actions.invoke(Constants.ACTION_CLEAN_MAP_STORE);
    this.unsubscribe();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.activeLocation && nextState.activeLocation != this.state.activeLocation) {
      this.setActiveLocation(nextState.activeLocation);
    }
    if (nextState.activeDataentry && nextState.activeDataentry != this.state.activeDataentry) {
      this.setActiveLocation(nextState.activeDataentry, true);
    }
  }

  onMapUpdated(data) {
    this.setState(data);
  }

  /*
    This is called by location onClick 
    */
  locationClick(e) {
    //using geonames lat and lng instead of event latlng should be more precise.
    let countryInfo = this.queryFeatures(e.latlng);
    let countryFeature = (countryInfo && countryInfo.length > 0) ? countryInfo[0].feature : null;
    let locationFeature = e.target.feature
    const {latlng} = e;
    //at this stage I have the location feature + country feature 
    Actions.invoke(Constants.ACTION_POPUP_INFO, {
      locationFeature, countryFeature, 'position': latlng
    })
  }

  /*Query features behind the point*/
  queryFeatures(latlng, layer) {

    let group = this.refs.country.leafletElement;
    let countryInfos = [];

    group.eachLayer(function(layer) {
      let countryInfo = leafletPip.pointInLayer(latlng, layer);
      if (countryInfo && countryInfo.length > 0) {
        countryInfos.push(countryInfo);
      }
    });
    return countryInfos[0];
  }

  /* Pass on location click from location list window, make selected location active and show popup */
  setActiveLocation(location, showDataEntry) {
    let countryInfo = this.queryFeatures([location.lng, location.lat], this.refs.country.leafletElement);
    let countryFeature = (countryInfo && countryInfo.length > 0) ? countryInfo[0].feature : null;
    this.refs.map.leafletElement.panTo({lat: location.lat, lng: location.lng});//center the map at point
    Actions.invoke(Constants.ACTION_POPUP_INFO, {
      locationFeature: {
        properties: location
      },
      countryFeature,
      'position': [location.lat, location.lng],
      'showDataEntry': showDataEntry
    })
  }

  render() { 
    return (

      <div id="mapContainer">
        <div className="map">  
          
          <DataEntryPopup/>
          
          <Map   {...this.state.map}  ref="map">
            <MapSize/>
            <MiniMap  collapsed={true} position='topright' topPadding= {1500} bottomPadding= {40}>            
              <LayerGroup name="Administrative Shapes" ref="country" showAsMiniMap={false}>
                {this.state.layers.countries?this.state.layers.countries.map((country)=>{
                  return <CountryLayer {...country}/>
                }):null}
              </LayerGroup>
                <GeocodingLayer name="Geocoding" onFeatureClick={this.locationClick.bind(this)}  {...this.state.layers.geocoding}/>         
                <GazetterLayer name="Available Locations" onFeatureClick={this.locationClick.bind(this)}  {...this.state.layers.locations}/>
         
            </MiniMap>
           
            <MapPopUp maxWidth="850" {...this.state.popup}>
                <LocationPopup/>
            </MapPopUp>
           
            <ZoomControl position="bottomright"/>

            <Control className="leaflet-control-layer-selector" position="bottomleft">
              <CountrySelector/>
            </Control>

            <Control className="leaflet-control-actions-buttons" position="bottomright">
                <ActionButtons/>
            </Control>
            
            <Control bottomPadding={80} topPadding={0} className="leaflet-control-info-panel"  position="topleft">
                <InfoPanel id={this.props.params.projectID}/>
            </Control>

           
                    
          </Map>
        </div>
      </div>
    )
  }
}

