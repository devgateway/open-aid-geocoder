

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';

import {L, Popup, Map, Marker, TileLayer,ZoomControl,MapLayer,ScaleControl} from 'react-leaflet'; 

import leafletPip from 'leaflet-pip';

import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

import CodingLocationLayer from './CodingLocationLayer.jsx';
import LocationsLayer  from './LocationsLayer.jsx';
import CountryLayer from './CountryLayer.jsx';
import CountryLayersControl from './CountryLayersControl.jsx';
import DataEntryPopup from './DataEntryPopup.jsx';
import SubmitGeocoding from './SubmitGeocoding.jsx';

import MapPopUp from './PopUp.jsx';
import LocationPopup from './LocationPopup.jsx'; 
import MapStore from '../../stores/Map.es6';
import MiniMap from './MiniMap.jsx';

import { featureGroup } from 'leaflet';

class LayerGroup extends MapLayer {
  componentWillMount() {
    
    super.componentWillMount();
    this.leafletElement = featureGroup();

    this.leafletElement.on('layeradd',this.onAddLayer.bind(this ))
  }

  onAddLayer(e){
    //this.props.layerControl.addLayer(e.layer,this.props.name);
  }

  render() {
    return this.renderChildrenWithProps({
      layerGroup: this.leafletElement,
    });
  }
}




class MapView extends React.Component {

  constructor() {
    super();
    this.state = MapStore.get();
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.unsubscribe=MapStore.listen(this.onMapUpdated.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.activeLocation && nextState.activeLocation != this.state.activeLocation) {
      this.setActiveLocation(nextState.activeLocation);
    }
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
    let countryInfo=this.queryFeatures(e.latlng);
    let countryFeature=(countryInfo && countryInfo.length >0)?countryInfo[0].feature:null;
    
    let locationFeature=e.target.feature

    const {latlng}=e;
    //at this stage I have the location feature + country feature 
    Actions.invoke(Constants.ACTION_POPUP_INFO,{ locationFeature, countryFeature, 'position':latlng}) 
  }
  
  /*Query features behind the point*/
  queryFeatures(latlng,layer){
    
    let group=this.refs.country.leafletElement;
    let countryInfos=[];
    
    group.eachLayer(function (layer) {
     let countryInfo= leafletPip.pointInLayer(latlng, layer);
     if (countryInfo && countryInfo.length > 0){
      countryInfos.push(countryInfo);
    }
  });
    return countryInfos[0]; 
  }
  
  /* Pass on location click from location list window, make selected location active and show popup */
  setActiveLocation(location)
  {
    let countryInfo = this.queryFeatures([location.lng,location.lat], this.refs.country.leafletElement);
    let countryFeature=(countryInfo && countryInfo.length >0)?countryInfo[0].feature:null;
    Actions.invoke(Constants.ACTION_POPUP_INFO,{locationFeature:{properties:location},countryFeature, 'position':[location.lat,location.lng]}) 
  }
  
/*
                    
*/                

render() {
  return (
    <div>

    <Map {...this.state.map}  ref="map">
    
    <MiniMap collapsed={true} position='topright' topPadding= {1500} bottomPadding= {40}>
        <LocationsLayer name="Available Locations" onFeatureClick={this.locationClick.bind(this)}  data={this.state.layers.locations?this.state.layers.locations.data:null}  autoZoom={this.state.layers.locations?this.state.layers.locations.autoZoom:null}></LocationsLayer>
        <CodingLocationLayer name="Geocoding" className="geocoding" onFeatureClick={this.locationClick.bind(this)}  data={this.state.geocoding} autoZoom={false}></CodingLocationLayer> 
    
    </MiniMap>

  
         <LayerGroup name="Administrative Shapes" ref="country">
           { this.state.layers.countries?this.state.layers.countries.map( (country)=>{return <CountryLayer {...country}/>}):null}
        </LayerGroup>
    
    
    <MapPopUp maxWidth="850" {...this.state.popup}><LocationPopup/></MapPopUp>
    <ZoomControl position="topright"/>
    <DataEntryPopup/>
    <SubmitGeocoding/>
    
    </Map>
    </div>
    )
}
}

export default MapView;