require('leaflet/dist/leaflet.css')
import { PropTypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal,Button} from 'react-bootstrap';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';


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
      }

/*Popup info*/

 class InfoView extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  onPickLocation(){
    this.props.onPickLocation?this.props.onPickLocation():null
  }

  render() {

    return (
       
    <div className={"popup "+this.props.status}>
                     

      <h4>{this.props.name}</h4>
       <div className="row"> 
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="geonameId,">Country</label>
              <div>{this.props.country?this.props.country.name:'NA'}</div>
            </div>
          </div>
         <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin1">First ADM</label>
              <div>{this.props.admin1?this.props.admin1.name:'NA'}</div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin2">Second ADM</label>
                <div>{this.props.admin2?this.props.admin2.name:'NA'}</div>
          
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
              <div>{this.props.geometry.coordinates.join(' ')}</div>
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
            <button className="btn btn-sm btn-success pull-right" onClick={this.onPickLocation.bind(this)}>Pick this location</button>
           </div>
        </div>
   
    </div>
    );
  }
}


export default class LocationPopup extends React.Component {

  static propTypes = {}

  constructor(props) {
    super(props);
  }

  turnDataEntryOn() {
    debugger;
    Actions.invoke(Constants.ACTION_OPEN_DATAENTRY_POPUP, this.props.location);

  }


  render() {
    const location = this.props.location;
      return ( <InfoView  {...location} onPickLocation={this.turnDataEntryOn.bind(this)}/>);
  }
}