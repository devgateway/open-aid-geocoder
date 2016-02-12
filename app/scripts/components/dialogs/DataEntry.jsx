import React from 'react';
import {ListGroup, ListGroupItem, Button, Modal, Grid, Col, Table, Row, Pagination}  from 'react-bootstrap';
import { Link  } from 'react-router';
import ShapesMapping from '../../util/ShapesMapping.es6';
import DataEntryStore from '../../stores/DataEntryStore.es6';
import  * as Actions from '../../actions/Actions.es6'
import Constants from '../../constants/Contants.es6';
import DataEntryHelp from '../../help/DataEntry.es6';
import ReactDOM from 'react-dom';
import Message from '../Message.jsx'


class AdminOptions extends React.Component {

  toggleAdminSource(e){    
      var newSource = e.target.parentElement.value; 
      this.props.changeCodingValue('adminSource', newSource);
      if (newSource=='geonames'){
        Actions.invoke(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES, {'geonameID': this.props.geocoding.id});
      }
  }  

  render() {
    let geocoding = this.props.geocoding;
    let adminSource = this.props.adminSource;
    return (
      <div className="pull-right options" id="adminOptionsContainer">
        <label className="inline mini">Use Admin Division from:</label> 
        {(geocoding.type=='geocoding' && geocoding.status!='NEW')? //if it is an existing location, it shows the "Stored" option
            <button className={adminSource=='saved'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='saved' onClick={this.toggleAdminSource.bind(this)}>
              <Message k="dataentry.sourceadmin.stored"/>
            </button>
          : null 
        }            
        {geocoding.adminCodes.shape? //if it have shapes data, it shows the "Shapes" option
            <button className={adminSource=='shape'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='shape' onClick={this.toggleAdminSource.bind(this)}>
              <Message k="dataentry.sourceadmin.shapes"/>
            </button> 
          : null 
        }             
        <button className={adminSource=='geonames'? "btn btn-xs btn-success" : "btn btn-xs btn-default"} value='geonames' onClick={this.toggleAdminSource.bind(this)}><Message k="dataentry.sourceadmin.geonames"/></button>
        {this.props.loadingAdminGeonames? 
          <i className="fa fa-spinner fa-spin"></i>
          : null 
        }
      </div>
    )
  }
}

/*Popup Data Entry*/
class DataEntryContent extends React.Component {

  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  codingValueChanged(e) {
    this.changeCodingValue(e.target.name, e.target.value);
    this.validateField(e.target.value, e.target.name)
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

  getAdminSource(geocoding){
    /*adminSource values:
        saved: load admin data from stored values
        shape: load admin data from shape info
        geocoding: load admin data from geonames
     */
    if (geocoding.adminSource){
      return geocoding.adminSource; //if adminSource is set, return it
    } else if (geocoding.type=='geocoding'){
      return 'saved'; //if adminSource is NOT set and it is an existing location, return saved
    } else if (geocoding.adminCodes.shape){
      return 'shape'; //else if it have shapes data, return shape
    } else {
      return 'geonames'; //otherwise, return geonames
    }
  }

  render() {  
    let geocoding = this.props.geocoding;
    let adminSource = this.getAdminSource(geocoding);
    let country = geocoding.adminCodes[adminSource].country.name;
    let admin1 = geocoding.adminCodes[adminSource].admin1 ? geocoding.adminCodes[adminSource].admin1.name:'N/A';
    let admin2 = geocoding.adminCodes[adminSource].admin2 ? geocoding.adminCodes[adminSource].admin2.name:'N/A';
    
    if(this.props.geocoding.confirmDelete=='TO_CONFIRM'){
      return (
      <div>    
        <h4 className='list-group-item-heading'>
          <Message k="dataentry.deletemessage"/>
        </h4>
        <hr/>
        <Button bsStyle='danger' onClick={this.cancelDelete.bind(this)}><Message k="general.no"/></Button>
        <Button bsStyle='success' className="pull-right" onClick={this.doDelete.bind(this)}><Message k="general.yes"/></Button>
      </div>
      )
    } else {
      return (
      <div id='dataentry' className={geocoding.type=='location'? 'new' : 'update'}>
        <div id='noneditablefields'>
          <div className="row"> 
            <div className="col-lg-12">
              <label  className="colored" for="admin1"><Message k="dataentry.name"/></label>
              <input type="text" className="form-control big" id="name" placeholder="name" value={geocoding.name} disabled/> 
            </div>
          </div>
          
          <div className="row"> 
            <div className="col-lg-4">
              <div className="form-group">
                <label  className="colored" for="country,"><Message k="dataentry.country"/></label>
                <input type="text" className="form-control" id="country" placeholder="NA" value={country || ''} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label  className="colored" for="admin1"><Message k="dataentry.firstadm"/></label>
                <input type="text" className="form-control" id="admin1" placeholder="NA" value={admin1 || ''} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label  className="colored" for="admin2"><Message k="dataentry.secondadm"/></label>
                <input type="text" className="form-control" id="admin2" placeholder="NA" value={admin2 || ''} disabled/>
              </div>
            </div>
            <AdminOptions 
                geocoding={geocoding} 
                adminSource={adminSource} 
                loadingAdminGeonames={this.props.loadingAdminGeonames}
                changeCodingValue={this.changeCodingValue}
                />
          </div>

          <div className="row">
            <div className="col-lg-4">
              <div className="form-group">
                <label  className="colored" for="id"><Message k="dataentry.identifier"/></label>
                <input type="text" className="form-control" id="id" placeholder="id" value={geocoding.id} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label  className="colored" for="geometryType"><Message k="dataentry.type"/></label>
                <input type="text" className="form-control" id="geometryType"  placeholder="" value={geocoding.geometry.type} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group" id="coordinates">
                <label className="colored"><Message k="dataentry.coordinates"/></label>
                <div>{geocoding.geometry.coordinates.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-3">
              <div className="form-group" >
                <label className="colored"><Message k="dataentry.featuredesignation"/></label>
                <input type="text" className="form-control" id="featureDesignation"  value={geocoding.featureDesignation.code} disabled/>
              </div>
            </div>
            <div className="col-lg-9"> 
              <div className="form-group" >
                <label>&nbsp;</label>
                <input type="text" className="form-control" id="featureDesignationName"  value={geocoding.featureDesignation.name} disabled/>
              </div>
            </div>
          </div>
        </div>
        <div className="row"> 
          <div className="col-lg-6"> 
            <div className="form-group" >
              <label  className="colored" for="locationClass"><Message k="dataentry.locationclass"/></label>
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
              <label  className="colored" for="Exactness"><Message k="dataentry.geographicexactness"/></label>
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
              <label  className="colored"><Message k="dataentry.activitydescription"/></label>
              <textarea   className="form-control" name="activityDescription" id="activityDescription" value={geocoding.activityDescription} onChange={this.codingValueChanged.bind(this)}></textarea>
            </div>
          </div>
        </div>

        <div className="row"> 
          <div className="col-lg-12 help-container"> 
            <div className='separator'/>        
            <DataEntryHelp  parentId='dataentry' type={geocoding.type}/>
            <div className='separator'/> 
            <button className="btn btn-lg btn-success pull-right" id="savebutton" onClick={this.onSave.bind(this)}>{geocoding.type=='location'? Message.t('dataentry.save') : Message.t('dataentry.update')}</button>
            {(geocoding.type!='location')?<button className="btn btn-lg btn-danger pull-right" id="deletebutton" onClick={this.onDelete.bind(this)}><Message k="dataentry.delete"/></button>:null}
            <button className="btn btn-lg btn-warning pull-right" id="cancelbutton" onClick={this.onCancel.bind(this)}><Message k="dataentry.cancel"/></button>      
            <button className="btn btn-lg btn-default pull-right" title={Message.t('dataentry.updatefromgeonames')} onClick={this.updateFromGeonames.bind(this)}>
              {(this.props.loadingGeonames)?<i className="fa fa-refresh fa-spin"></i>:  <i className="fa fa-refresh"></i> }
            </button>        
          </div>
        </div>
        {this.props.error?
          <div className="row"> 
            <div className="col-lg-12"> 
              <div className="form-group has-error">
                <label  className="colored">
                  ERROR: {this.props.error}
                </label>
              </div>
            </div>
          </div>
        : null}
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
  }

  render() {
  return (
    <Modal className="dataentry-dialog" {...this.props} show={this.state.showPopup} onHide={this.close}>
      <Modal.Body>
        <DataEntryContent {...this.state} onCancel={this.close.bind(this)}/>
      </Modal.Body>
    </Modal>
    )
  }
}

export default DataEntry

