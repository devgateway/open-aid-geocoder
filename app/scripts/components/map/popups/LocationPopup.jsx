require('leaflet/dist/leaflet.css')
import { PropTypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal,Button} from 'react-bootstrap';
import * as Actions from '../../../actions/Actions.es6';
import Constants from '../../../constants/Contants.es6';
import Message from '../../Message.jsx';
import LanStore from '../../../stores/LanStore.es6';

/*Popup info*/

class InfoView extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unsubscribe = LanStore.listen(this.changeLanguage.bind(this));
  }

  changeLanguage(lan){
    this.forceUpdate()
  }
  
  onPickLocation(){
    this.props.onPickLocation?this.props.onPickLocation():null
  }

  render() {
    
    var cssClass;
    if (this.props.type == 'location') {
      cssClass = 'popup-location';
    }
    else {
      cssClass = this.props.status ? 'popup-' + this.props.status.toLowerCase() : 'popup-existing';
    }

    let country,admin1,admin2 ,comment;

    if (this.props.type=='geocoding'){
      country=this.props.country?this.props.country.name:null;
      admin1=this.props.admin1?this.props.admin1.name:null;
      admin2=this.props.admin2?this.props.admin2.name:null;
    } else if (this.props.adminCodes.shape) {
      country=this.props.adminCodes.shape.country?this.props.adminCodes.shape.country.name:null;
      admin1=this.props.adminCodes.shape.admin1?this.props.adminCodes.shape.admin1.name:null;
      admin2=this.props.adminCodes.shape.admin2?this.props.adminCodes.shape.admin2.name:null;
      comment= Message.t('locationpopup.adminsource.shapes');
    } else {
      country=this.props.adminCodes.geonames.country?this.props.adminCodes.geonames.country.name:null;
      admin1=this.props.adminCodes.geonames.admin1?this.props.adminCodes.geonames.admin1.name:null;
      admin2=this.props.adminCodes.geonames.admin2?this.props.adminCodes.geonames.admin2.name:null;
      comment= Message.t('locationpopup.adminsource.geonames');
    }

    switch(this.props.adminSource) {
      case 'geonames':
      comment=Message.t('locationpopup.adminsource.geonames');
      break;
      case 'shape':
      comment=Message.t('locationpopup.adminsource.shapes');
      break;
      case 'saved':
      comment=Message.t('locationpopup.adminsource.stored');
      break;
    }

    return (
        <div id="location-info-popup" className={cssClass}>

          <h2>{this.props.name}</h2>          

          <div className="row border"> 
            <div className="col-lg-4">
                <label className="mini"><Message k="dataentry.country"/> <span className="small">*</span></label>
            </div>
            <div className="col-lg-4">
                <label className="mini"><Message k="dataentry.firstadm"/> <span className="small">*</span></label>
            </div>
            <div className="col-lg-4">
                <label className="mini"><Message k="dataentry.secondadm"/> <span className="small">*</span></label>
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-4">
               <label className="green text-large bolder">{country||'NA'}</label>
            </div>
            
            <div className="col-lg-4">
                <label className="green text-large bolder">{admin1||'NA'}</label>
            </div>
            <div className="col-lg-4">
                <label className="green text-large bolder">{admin2||'NA'}</label>
            </div>
          </div>

          <div className="row border">
            <div className="col-lg-3">
                <label className="mini"><Message k="dataentry.identifier"/></label>
            </div>
            <div className="col-lg-4">
             
                <label className="mini"><Message k="dataentry.type"/></label>
            </div>
            <div className="col-lg-5">
                <label className="mini"><Message k="dataentry.coordinates"/></label>
            </div>
          </div>


           <div className="row">
            <div className="col-lg-3">
                <label className="green text-large bolder">{this.props.id}</label>
              
            </div>
            <div className="col-lg-4">
             
                <label className="green text-large bolder">{this.props.geometry.type}</label>
              
            </div>
            <div className="col-lg-5">
               <label className="green text-large bolder">
                  {this.props.geometry.coordinates?this.props.geometry.coordinates.map(function(c){return parseFloat(c).toFixed(3)+" "}):null}
                </label>
            </div>
          </div>


          <div className="row border"> 
            <div className="col-lg-12">
                <label className="mini"><Message k="dataentry.featuredesignation"/></label>
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-12">
                <label className="green text-large bolder">{this.props.featureDesignation.code} - {this.props.featureDesignation.name} </label> 
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-12"> 

              <div className="small"><span>* {comment} </span></div>
              
              <button 
              className={this.props.type=='location'? "btn btn-sm btn-success pull-right" :"btn btn-sm btn-warning pull-right"} 
              onClick={this.onPickLocation.bind(this)}>
              {this.props.type=='location'? Message.t('locationpopup.picklocation') : Message.t('locationpopup.update')}
            </button>
          
        </div>
        </div>
      </div>
      );
}
}

export default class LocationPopup extends React.Component {

  constructor(props) {
    super(props);
  }

  turnDataEntryOn() {
    Actions.invoke(Constants.ACTION_OPEN_DATAENTRY_POPUP, this.props.location);
  }

  render() {
    const location = this.props.location;
    return ( <InfoView  {...location} onPickLocation={this.turnDataEntryOn.bind(this)}/>);
  }
}