require('leaflet/dist/leaflet.css');
import { PropTypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal,Button} from 'react-bootstrap';
import * as Actions from '../../../actions/Actions.es6';
import Constants from '../../../constants/Contants.es6';


const LOCATION_PROTOTYPE={
  'name':null,
  'id':null,
  'description': null,
  'activityDescription': null,
  'country': null,
  'admin1': null,
  'admin2': null,
  'geometry': null,
  'featureDesignation': null,
  'type':'location',
  'status':'',
  'locationClass':null, 
  'exactness': null, 
};

/*Popup info*/

class InfoView extends React.Component {

  constructor(props) {
    super(props);
  }

  onPickLocation(){
    this.props.onPickLocation?this.props.onPickLocation():null;
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

    if (this.props.type!='geocoding'){
      if (this.props.adminCodes.shape){
        country=this.props.adminCodes.shape.country.name;
        admin1=this.props.adminCodes.shape.admin1.name;
        admin2=this.props.adminCodes.shape.admin2.name;
        comment='Using shape values';
      }else if (

        this.props.adminCodes.geonames){
        country=this.props.adminCodes.geonames.country.name;
        admin1=this.props.adminCodes.geonames.admin1.name;
        admin2=this.props.adminCodes.geonames.admin2.name;
        comment='Using gazetter values';
      }
    }
    else{
      //it is geocoding
      country=this.props.country.name;
      admin1=this.props.admin1?this.props.admin1.name:null;
      admin2=this.props.admin2?this.props.admin1.name:null;
      comment='Using stored values';
    }


    return (

      <div className={cssClass}>


      <h4>{this.props.name}</h4>
      
      <div className="row"> 

      <div className="col-lg-4">
      <div className="form-group">
      <label  for="geonameId,">Country <span className="small">*</span></label>
      <div>{country||'NA'}</div>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="form-group">
      <label  for="admin1">First ADM <span className="small">*</span></label>
      <div>{admin1||'NA'}</div>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="form-group">
      <label  for="admin2">Second ADM <span className="small">*</span></label>
      <div>{admin2||'NA'}</div>

      </div>
      </div>
      </div>


      <div className="row">
      <div className="col-lg-4">
      <div className="form-group">
      <label  for="lat">Identifier</label>
      <div>{this.props.id}</div>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="form-group">
      <label  for="lat">Type</label>
      <div>{this.props.geometry.type}</div>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="form-group">
      <label  for="lat">Coordinates</label>
      <div>{this.props.geometry.coordinates.join(', ')}</div>
      </div>
      </div>
      </div>

      <div className="row"> 
      <div className="col-lg-12">
      <div className="form-group">
      <label  for="typeCode">Feature Designation</label>
      <div>{this.props.featureDesignation.code} - {this.props.featureDesignation.name} </div> 
      </div>
      </div>
      </div>


      <div className="row"> 
      <div className="col-lg-12"> 
      <button 
      className={this.props.type=='location'? 'btn btn-sm btn-success pull-right' :'btn btn-sm btn-warning pull-right'} 
      onClick={this.onPickLocation.bind(this)}>
      {this.props.type=='location'? 'Pick this location' : 'Update'}
      </button>
      </div>

      </div>

      <div className ="row">
      <div className="col-lg-12">
      <div className="form-group">
      <div className="small"><span>* {comment} </span></div>
      </div>
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