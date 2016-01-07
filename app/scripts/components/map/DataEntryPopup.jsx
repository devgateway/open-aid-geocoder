import React from 'react';
import {ListGroup, ListGroupItem, Button, Modal, Grid, Col, Table, Row, Pagination}  from 'react-bootstrap';
import { Link  } from 'react-router';
import ShapesMapping from '../../util/ShapesMapping.es6';
import DataEntryStore from '../../stores/DataEntryStore.es6';
import  * as Actions from '../../actions/Actions.es6'
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

/*Popup Data Entry*/
 class DataEntryContent extends React.Component {

  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      showDeleteDialog: false,
      geocoding: Object.assign({}, LOCATION_PROTOTYPE)
    };
  }


  locationClassChanged(e) {
    let locationClass = Constants.LOCATION_CLASS_LIST.find((item) => {
      if (item.code == e.target.value) return item;
    }) || null;
    let newGeocoding = Object.assign(this.state.geocoding, {
      locationClass: locationClass
    });
    this.setState(Object.assign(this.state, {
      geocoding: newGeocoding
    }));
    this.validateField(this.state.geocoding.locationClass, 'locationClass')

  }

  exactnessChanged(e) {
    let exactness = Constants.EXACTNESS_LIST.find((item) => {
      if (item.code == e.target.value) return item;
    }) || null;
    let newGeocoding = Object.assign(this.state.geocoding, {
      exactness: exactness
    });
    this.setState(Object.assign(this.state, {
      geocoding: newGeocoding
    }));
    this.validateField(this.state.geocoding.exactness, 'exactness')
  }



  activityDescriptionChanged(e) {
    let newGeocoding = Object.assign(this.state.geocoding, {
      activityDescription: e.target.value
    });
    this.setState(Object.assign(this.state, {
      geocoding: newGeocoding
    }));
    this.validateField(this.state.geocoding.activityDescription, 'activityDescription')
  }


  onDelete() {
    this.setState(Object.assign(this.state, {
      confirmDelete: true
    }))
  }

  doDelete() {
    Actions.invoke(Constants.ACTION_DELETE_LOCATION, this.props.id)
  }

  cancelDelete() {
    this.setState(Object.assign(this.state, {
      confirmDelete: false
    }))
  }

  onSave() {
    let geocoding=this.validate()
    if (geocoding) {
        Actions.invoke(Constants.ACTION_SAVE_LOCATION,geocoding)
    }
    this.onCancel();
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

    validate() {

      let geocoding = Object.assign(this.state.geocoding, {
        name: this.props.name,
        'id': this.props.id,
        'country': this.props.country,
        'admin1': this.props.admin1,
        'admin2': this.props.admin2,
        'geometry': this.props.geometry,
        'featureDesignation': this.props.featureDesignation,
        'type': this.props.type,
        'status': this.props.status
      });

      let validObject = (this.validateField(geocoding.exactness, 'exactness') &
        this.validateField(geocoding.locationClass, 'locationClass') &
        this.validateField(geocoding.activityDescription, 'activityDescription') &
        this.validateField(geocoding.admin1, 'admin1') &
        this.validateField(geocoding.admin2, 'admin2'));
      if (validObject) {

        return geocoding;

      } else {

        return null;

      }

    }

    onCancel() {
      this.props.onCancel ? this.props.onCancel() : null
    }

    render() {
      if(this.state.confirmDelete){
        return (    
          <div className={"dataEntry "+this.props.status}>
            <div className="row"> 
              <div className="col-lg-12">
                <h4 className="danger"> This location will be marked as deleted, are you sure to continue?</h4>  
              </div>
            </div>
            <div className="row"> 
              <div className="col-lg-8 col-lg-offset-4" >
                <button className="btn btn-sm btn-success" onClick={this.cancelDelete.bind(this)}>NO</button>
                <button className="btn btn-sm btn-danger" onClick={this.doDelete.bind(this)}>YES</button>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="dataEntry">
            <div className="row"> 
              <div className="col-lg-12">
                <label  for="admin1">Name</label>
                <input type="text" className="form-control big success" id="name" placeholder="name" value={this.props.name} disabled/> 
              </div>
            </div>
            <div className="row"> 
              <div className="col-lg-4">
                <div className="form-group">
                  <label  for="country,">Country</label>
                  <input type="text" className="form-control" id="country" placeholder="NA" value={this.props.country?this.props.country.name:''} disabled/>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label  for="admin1">First ADM</label>
                  <input type="text" className="form-control" id="admin1" placeholder="NA" value={this.props.admin1?this.props.admin1.name:''} disabled/>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label  for="admin2">Second ADM</label>
                  <input type="text" className="form-control" id="admin2" placeholder="NA" value={this.props.admin2?this.props.admin2.name:''} disabled/>
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
                  <div className="row">
                    <div className="col-lg-3">
                      <input type="text" className="form-control" id="" placeholder="geometry.type" value={this.props.featureDesignation.code} disabled/>
                    </div>
                    <div className="col-lg-9"> 
                      <input type="text" className="form-control" id="" placeholder="geometry.type" value={this.props.featureDesignation.name} disabled/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row"> 
              <div className="col-lg-6"> 
                <div className="form-group">
                  <label  for="locationClass">Location Class</label>
                  <select className="form-control" name="locationClass" id="locationClass" onChange={this.locationClassChanged.bind(this)}>
                   <option value="">Select</option>
                    {
                      Constants.LOCATION_CLASS_LIST.map((item)=>{return (<option key={item.code} value={item.code}>{item.name}</option>)})
                    }
                  </select>
                </div>
              </div>
              <div className="col-lg-6"> 
                <div className="form-group">
                  <label  for="Exactness">Geographic Exactness </label>
                  <select className="form-control" name="exactness" id="exactness" onChange={this.exactnessChanged.bind(this)}>
                    <option value="">Select</option>
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
                <button className="btn btn-sm btn-success pull-right" onClick={this.onSave.bind(this)}>Save</button>
                {(this.props.status!="NEW")?                <button className="btn btn-sm btn-danger pull-right" onClick={this.onDelete.bind(this)}>Delete</button>:null}
                <button className="btn btn-sm btn-warning pull-right" onClick={this.onCancel.bind(this)}>Cancel</button>
              </div>
            </div>
          </div>
        );
      }//end else
    }
}

/*
  Renders a  List of Country Layers  
*/
class DataEntry extends React.Component{
  constructor() {
    super();
      this.store=DataEntryStore;
      this.state = {'showPopup': false};
  }

  componentDidMount() {
    debugger;
    this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  onStoreChange(storeData){
    debugger;
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

