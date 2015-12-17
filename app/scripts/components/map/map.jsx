require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import { Popup, Map, Marker, TileLayer  } from 'react-leaflet'; 

import leafletPip from 'leaflet-pip';


/*Stores*/
import LocationsGeoJsonStore from '../../stores/LocationsGeoJson.es6';
import ShapesStore from '../../stores/ShapesStore.es6';
import PopUpStore from '../../stores/Popup.es6';
import GeocodingStore from '../../stores/Geocoding.es6';

import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

import LocationsLayer  from './LocationsLayer.jsx';
import CountryLayer from './CountryLayer.jsx';
import MapPopUp from './PopUp.jsx';
import DataEntry from  './DataEntry.jsx';

 class LocationInfo extends React.Component {
 
   static propTypes = {}
 
   constructor(props) {
     super(props);
   }

   codeLocation(){

     Actions.invoke(Constants.ACTION_CODE_LOCATION,this.props) ///Country shape should be loaded after loading project information
   }
 
   render() {
    const { NAME_0, NAME_1, NAME_2,fclName,fcode,fcodeName,geonameId, lat, lng, name , toponymName, position} = this.props;
     return (
        <div className="popup">
             <h4> {name} </h4>
              <p className="text-muted"><strong>Admin 1</strong>: {(NAME_1)?NAME_1:'No Data'} </p>
              <p className="text-muted"><strong>Admin 2:</strong>  {(NAME_2)?NAME_2:'No Data'}</p>
              <p className="text-muted">{fcode} - {fcodeName}</p>
              <p className="text-muted">{toponymName}</p>
              <div className="row"> 
                 <Button className="pull-right"  bsSize="xsmall" bsStyle="warning" onClick={this.codeLocation.bind(this)}>Pick Location</Button>
              </div>
        </div>
     );
   }
 }
 

class MapView extends React.Component {

  constructor() {
    super();
    this.unsubscribers=new Array();
    this.state = {data: [],center: [0.0, 0.0],zoom: 3, mode:'info'}
  }

  componentDidMount() {
    /*Set listeners*/
    this.unsubscribers.push(LocationsGeoJsonStore.listen(this.onLocationsUpdated.bind(this)));
    this.unsubscribers.push(ShapesStore.listen(this.onShapeUpdated.bind(this))); 
    this.unsubscribers.push(PopUpStore.listen(this.onPopupUpdated.bind(this)));
    this.unsubscribers.push(GeocodingStore.listen(this.onGeocodingUpdate.bind(this)));

    /*Invoke initial actions*/
    Actions.invoke(Constants.ACTION_LOAD_SHAPE,'MOZ') ///Country shape should be loaded after loading project information

  }

  componentWillUnmount() {
    this.unsubscribers.forEach(function(unsubscriber){
        unsubscriber();
    })
  }

  /*Handle updates of country shapes*/
  onShapeUpdated(data) {
    this.setState(Object.assign(this.state, {
      'shape': data.shape
    }))
  }

  /*Habdle updates of locations*/
  onLocationsUpdated(data) {
    this.setState(Object.assign(this.state, {
      'locations': data.geojson
    }))
  }

  onPopupUpdated(data) {
    this.setState(Object.assign(this.state, {
      'info': data,
      'mode': 'info'
    }))
  }

  onGeocodingUpdate(data) {
    this.setState(Object.assign(this.state, {
      'geocoding': data,
      'mode': 'dataEntry'
    }))
  }

  /*this is called by location onClick */
  locationClick(e){  
    //e.targer.feature 
    //using geonames lat and lng instead of event latlng should be more precise.
    let countryInfo=this.queryFeatures(e.latlng,this.refs.countries.leafletElement);

    let locationFeature=e.target.feature
    let countryFeature=(countryInfo && countryInfo.length >0 )?countryInfo[0].feature:null;
    const { latlng }=e;
    //at this stage I have the location feature + country feature 
    Actions.invoke(Constants.ACTION_POPUP_INFO,{ locationFeature, countryFeature, 'position':latlng}) ///Country shape should be loaded after loading project information
  }
 
  /*Query features behind the point*/
  queryFeatures(latlng,layer){
   const data= leafletPip.pointInLayer(latlng, layer);
   return data;
  }

  render() {

    var popupContent=(this.state.mode=='info')?(<MapPopUp maxWidth="850" {...this.state.info}><LocationInfo/></MapPopUp>):(<MapPopUp maxWidth="850" {...this.state.geocoding}><DataEntry/></MapPopUp>);

    return (
        <div>
            <Map center={this.state.center} zoom={this.state.zoom} ref="map">
                <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <LocationsLayer   onFeatureClick={this.locationClick.bind(this)}  data={this.state.locations} autoZoom={true}></LocationsLayer>
                <CountryLayer data={this.state.shape} autoZoom={true}  ref="countries"/>  
                  {popupContent}
            </Map>
       </div> )
  }
}


export default  MapView