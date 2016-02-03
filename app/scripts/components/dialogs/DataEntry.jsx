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
class DataEntryContent extends DataEntryHelp {

  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      loadingAdminGeonames: false,
      loadingGeonames: false,
      showDeleteDialog: false,
      geocoding: {},
      admSource: this.props.type=='geocoding'? 'saved' : 'shapes'
    };
  }

  componentWillMount() {
    this.setState({
      'geocoding': this.props,
      'admSource': this.props.type=='geocoding'? 'saved' : 'shapes'
    });

    
  }

  locationClassChanged(e) {
    let locationClass = Constants.LOCATION_CLASS_LIST.find((item) => {
      if (item.code == e.target.value) return item;
    }) || null;
    let newGeocoding = Object.assign({}, this.state.geocoding);
    Object.assign(newGeocoding, {
      'locationClass': locationClass
    });
    this.setState({
      'geocoding': newGeocoding
    });
    this.validateField(locationClass, 'locationClass');
  }

  exactnessChanged(e) {
    let exactness = Constants.EXACTNESS_LIST.find((item) => {
      if (item.code == e.target.value) return item;
    }) || null;
    let newGeocoding = Object.assign({}, this.state.geocoding);
    Object.assign(newGeocoding, {
      'exactness': exactness
    });
    this.setState({
      'geocoding': newGeocoding
    });
    this.validateField(exactness, 'exactness');
  }

  activityDescriptionChanged(e) {
    let newGeocoding = Object.assign({}, this.state.geocoding);
    let activityDescription = e.target.value;
    Object.assign(newGeocoding, {
      'activityDescription': activityDescription
    });
    this.setState({
      'geocoding': newGeocoding
    });
    this.validateField(activityDescription, 'activityDescription', (val) => {
      return (val != null && val.length > 0)
    });
  }


  onDelete() {
    this.setState(Object.assign(this.state, {
      confirmDelete: true
    }))
  }

  doDelete() {
      //Actions.invoke(Constants.ACTION_DELETE_LOCATION, this.props.id)
      this.setState(Object.assign(this.state, {
        deleteConfirmed: true
      }));
      this.save(true);
    }

    cancelDelete() {
      this.setState(Object.assign(this.state, {
        confirmDelete: false
      }))
    }

    onSave(){
      this.save(false)
    }

    save(skipValidation){      
      let geocoding = this.buildGecoding(this.state.geocoding);
      let valid=(skipValidation)? true: this.validate(geocoding);
      if (valid) {
        let prev_status = geocoding.status;
        let status = geocoding.type == 'location' ? 'NEW' : this.state.deleteConfirmed ? 'DELETED' : 'UPDATED';
        if (prev_status == 'NEW' && status == 'DELETED') {
          status = 'LOCATION';
        }
        if (prev_status == 'NEW' && status == 'UPDATED') {
          status = 'NEW';
        }
        let saveGeo = Object.assign({}, geocoding);
        Object.assign(saveGeo, {'status': status});
        Actions.invoke(Constants.ACTION_SAVE_LOCATION, saveGeo);
        this.onCancel();
      } 
    }


    /**
     * Create final geocoding object 
     * @return {[type]} [description]
     */
     buildGecoding(source) {
      var newGeocoding={};
      Object.assign(newGeocoding, {
        name: source.name,
        'id': source.id,
        'geometry': source.geometry,
        'description':source.description,
        'featureDesignation': source.featureDesignation,
        'type': source.type,
        'status': source.status,
        'activityDescription':source.activityDescription,
        'locationClass':source.locationClass,
        'exactness':source.exactness,

      });

      switch(this.state.admSource) {
        case 'saved':          
          break;
        case 'shapes':
          Object.assign(newGeocoding, {
            'country': source.adminCodes.shape.country,
            'admin1': source.adminCodes.shape.admin1,
            'admin2': source.adminCodes.shape.admin2,
          });
          break;
        case 'geonames':
          Object.assign(newGeocoding, {
            'country': source.adminCodes.geonames.country,
            'admin1': source.adminCodes.geonames.admin1,
            'admin2': source.adminCodes.geonames.admin2,
          });
          break;
      }
      
      return newGeocoding;
    }

    /**
     * Validate the new geocoding object
     */

     validate(newGeocoding) {
      return (
        this.validateField(newGeocoding.exactness, 'exactness') & 
        this.validateField(newGeocoding.locationClass, 'locationClass') &
        this.validateField(newGeocoding.activityDescription, 'activityDescription', (val) => {return (val != null && val.length > 0)} ) &
        this.validateField(newGeocoding.country, 'country',(val) => {return (val != null && val.code!=null && val.name!=null)} ) //& 
        //this.validateField(newGeocoding.admin1, 'admin1',(val) => {return (val != null && val.code!=null && val.name!=null)}) & 
        //this.validateField(newGeocoding.admin2, 'admin2',(val) => {return (val != null && val.code!=null && val.name!=null)})
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
      this.props.onCancel ? this.props.onCancel() : null
    }

    updateFromGeonames() {
      Actions.invoke(Constants.ACTION_SEARCH_LOCATION_BY_GEONAMEID, {'geonameID': this.props.id});
      let newState=Object.assign({},this.state);
      Object.assign(newState,{'admSource': 'geonames', 'loadingGeonames': true});
      this.setState(newState); 
    }

    toggle(e){
      let newState=Object.assign({},this.state);
      let newSource =  e.target.value;
      Object.assign(newState,{'admSource': e.target.value});
      let holder;
      switch(newSource) {
        case 'saved':  
          holder = this.props;      
          break;
        case 'shapes':
          holder = this.props.adminCodes.shape;
          break;
        case 'geonames':
          Object.assign(newState, {'loadingAdminGeonames': true});
          Actions.invoke(Constants.ACTION_UPDATE_ADM_FROM_GEONAMES, {'geonameID': this.props.id});
          holder=this.props.adminCodes.geonames;
          break;
      }
      //this.validateField(holder.country, 'country',(val) => {return (val != null && val.code!=null && val.name!=null)} ) & 
      //this.validateField(holder.admin1, 'admin1',(val) => {return (val != null && val.code!=null && val.name!=null)}) & 
      //this.validateField(holder.admin2, 'admin2',(val) => {return (val != null && val.code!=null && val.name!=null)})
      this.setState(newState);  
   }

   render() {
    
    let country,admin1,admin2 ,comment;
    switch(this.state.admSource) {
      case 'saved':  
        country=this.props.country.name;
        admin1=this.props.admin1?this.props.admin1.name:null;
        admin2=this.props.admin2?this.props.admin2.name:null;      
        break;
      case 'shapes':
        country=this.props.adminCodes.shape.country.name;
        admin1=this.props.adminCodes.shape.admin1.name;
        admin2=this.props.adminCodes.shape.admin2.name;
        break;
      case 'geonames':
        country=this.props.adminCodes.geonames.country.name;
        admin1=this.props.adminCodes.geonames.admin1.name;
        admin2=this.props.adminCodes.geonames.admin2.name;
        break;
    }
   /**/

   if(this.state.confirmDelete){
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
          <div className={this.props.type=='location'? 'dataEntry' : 'dataEntryEdition'}>
            <div className="row"> 

              <div className="col-lg-12">
                <label  for="admin1">Name</label>
                <input type="text" className="form-control big" id="name" placeholder="name" value={this.props.name} disabled/> 
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
              {(this.props.type=='geocoding')?<button className={this.state.admSource=='saved'? 'btn btn-xs btn-success' : 'btn btn-xs btn-default'} value='saved' onClick={this.toggle.bind(this)}> Stored </button>: null }
              
              <button className={this.state.admSource=='shapes'? 'btn btn-xs btn-success' : 'btn btn-xs btn-default'} value='shapes' onClick={this.toggle.bind(this)}>Shapes </button> 
              
              <button className={this.state.admSource=='geonames'? 'btn btn-xs btn-success' : 'btn btn-xs btn-default'} value='geonames' onClick={this.toggle.bind(this)}>Geonames </button>
               {(!this.props.adminCodes.geonames.country.name && this.state.loadingAdminGeonames)?<i className="fa fa-spinner fa-spin"></i>: null }
            </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="form-group">
                <label  for="id">Identifier</label>
                <input type="text" className="form-control" id="id" placeholder="id" value={this.props.id} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label  for="geometry.type">Type</label>
                <input type="text" className="form-control" id="geometryType"  placeholder="" value={this.props.geometry.type} disabled/>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group small" id="coordinates">
                <label  for="lat">Coordinates</label>
                <div>{this.props.geometry.coordinates.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-12">
              <div className="form-group">
                <label  for="typeCode">Feature Designation</label>
                <div className="row" id="featureDesignationContainer">
                  <div className="col-lg-3">
                    <input type="text" className="form-control" id="featureDesignation"  value={this.props.featureDesignation.code} disabled/>
                  </div>
                  <div className="col-lg-9"> 
                    <input type="text" className="form-control" id="featureDesignationName"  value={this.props.featureDesignation.name} disabled/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row"> 
            <div className="col-lg-6"> 
              <div className="form-group" >
                <label  for="locationClass">Location Class</label>
                <select value={this.state.geocoding.locationClass? this.state.geocoding.locationClass.code : ''} className="form-control" name="locationClass" id="locationClass" onChange={this.locationClassChanged.bind(this)}>
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
              <select value={this.state.geocoding.exactness? this.state.geocoding.exactness.code : ''} className="form-control" name="exactness" id="exactness" onChange={this.exactnessChanged.bind(this)}>
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
            <textarea   className="form-control" id="activityDescription" value={this.state.geocoding.activityDescription} onChange={this.activityDescriptionChanged.bind(this)}></textarea>
          </div>
        </div>
      </div>

      <div className="row"> 
        <div className="col-lg-12"> 
          <button className="btn btn-sm btn-default pull-left" title='Update data from Geonames service' onClick={this.updateFromGeonames.bind(this)}>
            {(!this.props.adminCodes.geonames.country.name && this.state.loadingGeonames)?
              <span className="fa fa-refresh fa-spin"></span>
            :  <span className="fa fa-refresh"></span> }
          </button>
          <button className="btn btn-sm btn-info pull-right help" onClick={this.help.bind(this)}><i className="fa fa-question-circle"></i></button>
          <button className="btn btn-sm btn-success pull-right" onClick={this.onSave.bind(this)}>{this.props.type=='location'? 'Save' : 'Update'}</button>
          {(this.props.type!='location')?<button className="btn btn-sm btn-danger pull-right" onClick={this.onDelete.bind(this)}>Delete</button>:null}
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
      let newState=Object.assign(this.state, {'showPopup': false});
      this.setState(newState);
      if (this.props.onClose){
        this.props.onClose();
      }
    }

    open(e){
    //Actions.invoke(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST);
    let newState=Object.assign(this.state, {'showPopup': true});
    this.setState(newState);
  }

  render() {
    return (
      <Modal {...this.props} show={this.state.showPopup} onHide={this.close}>
      <Modal.Body>
      <DataEntryContent {...this.state.location} onCancel={this.close.bind(this)}/>
      </Modal.Body>
      </Modal>
      )
  }
}


export default DataEntry

