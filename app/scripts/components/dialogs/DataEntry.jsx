import React from 'react';
import {ListGroup, ListGroupItem, Button, Modal, Grid, Col, Table, Row, Pagination}  from 'react-bootstrap';
import { Link  } from 'react-router';
import ShapesMapping from '../../util/ShapesMapping.es6';
import DataEntryStore from '../../stores/DataEntryStore.es6';
import  * as Actions from '../../actions/Actions.es6'
import Constants from '../../constants/Contants.es6';
import DataEntryHelp from '../../help/DataEntry.es6';
import ReactDOM from 'react-dom';



/*Popup Data Entry*/
class DataEntryContent extends React.Component {

  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  codingValueChanged(e) {
    this.changeCodingValue(e.target.name, e.target.value);
  }

  changeCodingValue(name, value){
    let val;
    switch(name) {
      case "locationClass":
        val = Constants.LOCATION_CLASS_LIST.find((item) => {if (item.code == value) return item;}) || null;
        break;
      case "exactness":
        val = Constants.EXACTNESS_LIST.find((item) => {if (item.code == value) return item;}) || null;        
        break;
      default:
        val = value;        
        break;
    }
    Actions.invoke(Constants.ACTION_CHANGE_CODING_VALUE, {'name': name, 'value': val});
  }

  onDelete() {
    this.changeCodingValue('confirmDelete', 'TO_CONFIRM');
  }

  doDelete() {
    this.changeCodingValue('confirmDelete', 'CONFIRMED');
    this.save(true);
  }

  cancelDelete() {
    this.changeCodingValue('confirmDelete', 'CANCELED');
  }

  onSave(){
    this.save(false)
  }

  save(skipValidation){      
    let valid=(skipValidation)? true: this.validate(this.props.geocoding);
    if (valid) {
      Actions.invoke(Constants.ACTION_PREPARE_SAVE_LOCATION);
      this.onCancel();
    } 
  }

  /**
   * Validate the new geocoding object
   */
  validate(newGeocoding) {
    return (
      this.validateField(newGeocoding.exactness, 'exactness') & 
      this.validateField(newGeocoding.locationClass, 'locationClass') &
      this.validateField(newGeocoding.activityDescription, 'activityDescription', (val) => {return (val != null && val.length > 0)} )
    );
  }

  validateField(value, elementId, validator) {
    if (!validator) { //default validator
      validator = (val) => {
        return val != null
      }; //validator should return true if object is valid or false if object si not valid
    }
    if (!validator(value)) {
      var element = document.getElementById(elementId);
      element.parentElement.classList.add('has-error');
      return false;
    } else {
      var element = document.getElementById(elementId);
      element.parentElement.classList.remove('has-error');
      return true;
    }
  }

  /*end field*/
  onCancel() {
    this.props.onCancel ? this.props.onCancel() : null;
  }

  updateFromGeonames() {
    Actions.invoke(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID, {'geonameID': this.props.geocoding.id});
    this.changeCodingValue('adminSource', 'geonames');
  }

  toggleAdminSource(e){    
      var newSource = e.target.value; 
      this.changeCodingValue('adminSource', newSource);
      if (newSource=='geonames'){
        Actions.invoke(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES, {'geonameID': this.props.geocoding.id});
      }
  }  

  render() {  
    let country,admin1,admin2 ,comment;
    let geocoding = this.props.geocoding;
    let adminSource = geocoding.adminSource || (geocoding.type=='geocoding'? 'saved' : geocoding.adminCodes.shape? 'shape' : 'geonames');
    country=geocoding.adminCodes[adminSource].country.name;
    admin1=geocoding.adminCodes[adminSource].admin1.name;
    admin2=geocoding.adminCodes[adminSource].admin2.name;
    
    if(this.props.geocoding.confirmDelete=='TO_CONFIRM'){
      return (
      <div>    
        <h4 className='list-group-item-heading'>
          This location will be marked as deleted, are you sure you want to continue?
        </h4>
        <hr/>
        <Button bsStyle='danger' onClick={this.cancelDelete.bind(this)}>No</Button>
        <Button bsStyle='success' className="pull-right" onClick={this.doDelete.bind(this)}>Yes</Button>
      </div>
      )
    } else {
      return (
      <div id='dataEntryContainer' className={geocoding.type=='location'? 'dataEntry' : 'dataEntryEdition'}>
        <div className="row"> 

          <div className="col-lg-12">
            <label  for="admin1">Name</label>
            <input type="text" className="form-control big" id="name" placeholder="name" value={geocoding.name} disabled/> 
          </div>
        </div>
        <div className="row"> 
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="country,">Country</label>
              <input type="text" className="form-control" id="country" placeholder="NA" value={country || ''} disabled/>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin1">First ADM</label>
              <input type="text" className="form-control" id="admin1" placeholder="NA" value={admin1 || ''} disabled/>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin2">Second ADM</label>
              <input type="text" className="form-control" id="admin2" placeholder="NA" value={admin2 || ''} disabled/>
            </div>
          </div>
      </div>

      <div className="row small mini ">       
        <div className="col-lg-12">
          <div className="pull-right bottom-line">
            Use Admin Division from:
            {(geocoding.type=='geocoding' && geocoding.status!='NEW')?<button className={adminSource=='saved'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='saved' onClick={this.toggleAdminSource.bind(this)}> Stored </button>: null }            
            {geocoding.adminCodes.shape? <button className={adminSource=='shape'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='shape' onClick={this.toggleAdminSource.bind(this)}>Shapes </button> : null }             
            <button className={adminSource=='geonames'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='geonames' onClick={this.toggleAdminSource.bind(this)}>Geonames </button>
            {(!geocoding.adminCodes.geonames.country.name && this.props.loadingAdminGeonames)?<i className="fa fa-spinner fa-spin"></i>: null }
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <div className="form-group">
            <label  for="id">Identifier</label>
            <input type="text" className="form-control" id="id" placeholder="id" value={geocoding.id} disabled/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label  for="geometry.type">Type</label>
            <input type="text" className="form-control" id="geometryType"  placeholder="" value={geocoding.geometry.type} disabled/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group small" id="coordinates">
            <label  for="lat">Coordinates</label>
            <div>{geocoding.geometry.coordinates.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="row"> 
        <div className="col-lg-12">
          <div className="form-group">
            <label  for="typeCode">Feature Designation</label>
            <div className="row" id="featureDesignationContainer">
              <div className="col-lg-3">
                <input type="text" className="form-control" id="featureDesignation"  value={geocoding.featureDesignation.code} disabled/>
              </div>
              <div className="col-lg-9"> 
                <input type="text" className="form-control" id="featureDesignationName"  value={geocoding.featureDesignation.name} disabled/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row"> 
        <div className="col-lg-6"> 
          <div className="form-group" >
            <label  for="locationClass">Location Class</label>
            <select value={geocoding.locationClass? geocoding.locationClass.code : ''} className="form-control" name="locationClass" id="locationClass" onChange={this.codingValueChanged.bind(this)}>
              <option>Select</option>
              {
                Constants.LOCATION_CLASS_LIST.map((item)=>{return (<option key={item.code} value={item.code}>{item.name}</option>)})
              }
            </select>
          </div>
        </div>
        <div className="col-lg-6"> 
          <div className="form-group">
            <label  for="Exactness">Geographic Exactness </label>
            <select value={geocoding.exactness? geocoding.exactness.code : ''} className="form-control" name="exactness" id="exactness" onChange={this.codingValueChanged.bind(this)}>
              <option>Select</option>
              {
                Constants.EXACTNESS_LIST.map((item)=>{return (<option key={item.code} value={item.code}>{item.name}</option>)})
              }
            </select>
          </div>
        </div>
      </div>

      <div className="row"> 
        <div className="col-lg-12"> 
          <div className="form-group">
            <label  for="typeCode">Activity Description</label>
            <textarea   className="form-control" name="activityDescription" id="activityDescription" value={geocoding.activityDescription} onChange={this.codingValueChanged.bind(this)}></textarea>
          </div>
        </div>
      </div>

      <div className="row"> 
        <div className="col-lg-12"> 
          <button className="btn btn-sm btn-default pull-left" title='Update data from Geonames service' onClick={this.updateFromGeonames.bind(this)}>
            {(!geocoding.adminCodes.geonames.country.name && this.props.loadingGeonames)?
              <span className="fa fa-refresh fa-spin"></span>
            :  <span className="fa fa-refresh"></span> }
          </button>
          <DataEntryHelp parentId='dataEntryContainer'/>
          <button className="btn btn-sm btn-success pull-right" onClick={this.onSave.bind(this)}>{geocoding.type=='location'? "Save" : "Update"}</button>
          {(geocoding.type!='location')?<button className="btn btn-sm btn-danger pull-right" onClick={this.onDelete.bind(this)}>Delete</button>:null}
          <button className="btn btn-sm btn-warning pull-right" onClick={this.onCancel.bind(this)}>Cancel</button>
        </div>
      </div>

      </div>
      );
    }//end else
  }
}


/*Data Entry Main Container*/
class DataEntry extends React.Component{
  constructor() {
    super();
    this.store=DataEntryStore;
    this.state = {'showPopup': false};
  }

  componentDidMount() {
    this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  onStoreChange(storeData){
    let newState=Object.assign(this.state, storeData);
    this.setState(newState);
  }

  close(e){
    Actions.invoke(Constants.ACTION_CLOSE_DATAENTRY_POPUP);
    if (this.props.onClose){
      this.props.onClose();
    }
  }

  render() {
  return (
    <Modal {...this.props} show={this.state.showPopup} onHide={this.close}>
      <Modal.Body>
        <DataEntryContent {...this.state} onCancel={this.close.bind(this)}/>
      </Modal.Body>
    </Modal>
    )
  }
}

export default DataEntry

