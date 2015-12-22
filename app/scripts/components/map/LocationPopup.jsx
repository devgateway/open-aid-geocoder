require('leaflet/dist/leaflet.css')
import { PropTypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal,Button} from 'react-bootstrap';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';


/*Popup info*/


 class InfoView extends React.Component {
  static propTypes = {
   };

  constructor(props) {
    super(props);
  }

  onPickLocation(){
    this.props.onPickLocation?this.props.onPickLocation():null
  }

  render() {

    return (
       <div className="popup">


      <h4>{this.props.name}</h4>
       <div className="row"> 
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="geonameId,">Country</label>
              <div>{this.props.admin0.name}</div>
            </div>
          </div>
         <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin1">First ADM</label>
              <div>{this.props.admin1.name}</div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="form-group">
              <label  for="admin2">Second ADM</label>
              <div>{this.props.admin2.name}</div>
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



/*Popup Data Entry*/
 class DataEntry extends React.Component {



  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {showDeleteDialog:false}
  }

  componentDidMount() {
   
  }

      
  onDelete() {

    this.setState(Object.assign(this.state,{confirmDelete:true}))
  }

  doDelete(){
    Actions.invoke(Constants.ACTION_DELETE_LOCATION,this.props.id)
  }

  cancelDelete(){
       this.setState(Object.assign(this.state,{confirmDelete:false}))
  }

  onSave() {
    if (this.validate){
      Actions.invoke(Constants.ACTION_SAVE_LOCATION,this.collectValue())   
    }
  }

  collectValue(){

  }

  onCancel() {
    this.props.onCancel ? this.props.onCancel() : null
  }

  descriptionChanged(){
    debugger;
  }

  locationClassChanged(){
    debugger;
  }

  exactnessChanged(){
    debugger;
  }

  validate(){
    debugger;
  }


  render() {
       
        if(this.state.confirmDelete){
         return (    <div className="dataEntry">
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

        }else{
       
        return (
           <div className="dataEntry">
              
            <div className="row"> 
              <div className="col-lg-12">
                <label  for="admin1">Name</label>
                <input type="text" className="form-control big success" id="admin0" placeholder="admin0" value={this.props.name} disabled/> 
              </div>
            </div>
         <div className="row"> 
              <div className="col-lg-4">
                <div className="form-group">
                  <label  for="admin0,">Country</label>
                  <input type="text" className="form-control" id="admin0" placeholder="admin0" value={this.props.admin0.name} disabled/>
              </div>
              </div>
             <div className="col-lg-4">
                <div className="form-group">
                  <label  for="admin1">First ADM</label>
                   <input type="text" className="form-control" id="admin1" placeholder="admin1" value={this.props.admin1.name} disabled/>

                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label  for="admin2">Second ADM</label>
                  <input type="text" className="form-control" id="admin2" placeholder="admin2" value={this.props.admin2.name} disabled/>

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
                  <input type="text" className="form-control" id="geometry.type" placeholder="geometry.type" value={this.props.geometry.type} disabled/>
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
                      <input type="text" className="form-control" id="geometry.type" placeholder="geometry.type" value={this.props.featureDesignation.code} disabled/>
                      </div>
                      <div className="col-lg-9"> 
                        <input type="text" className="form-control" id="geometry.type" placeholder="geometry.type" value={this.props.featureDesignation.name} disabled/>
                    </div>
                    </div>
                </div>
              </div>
            </div>

             <div className="row"> 
              <div className="col-lg-6"> 
                <div className="form-group">
                  <label  for="Class">Location Class</label>
                  <select className="form-control" name="locationClass" onChange={this.locationClassChanged.bind(this)}>
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
                  
                  <select className="form-control" name="exactness" onChange={this.exactnessChanged.bind(this)}>
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
                  <textarea   className="form-control" onChange={this.descriptionChanged.bind(this)}></textarea>
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

export default class LocationPopup extends React.Component {

  static propTypes = {

  }

  constructor(props) {
    super(props);
    this.state = {'mode': 'Info'}
  }

  turnDataEntryOn() {
    debugger;
    this.setState({
      'mode': 'DataEntry'
    })
  }

  turnDataEntryOff() {
    this.setState({
      'mode': 'Info'
    })
  }

  render() {
    const location = this.props.location;

    if (this.state.mode == 'Info') {
      return ( <InfoView  {...location} onPickLocation={this.turnDataEntryOn.bind(this)}/>);
    }else {
     return  ( <DataEntry {...location} 
        onSave={this.turnDataEntryOff.bind(this)}
        onDelete={this.turnDataEntryOff.bind(this)}
        onCancel={this.turnDataEntryOff.bind(this)}/>);
    }
  }
}