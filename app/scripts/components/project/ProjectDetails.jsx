import React from 'react';
import {Tabs, Tab, Button, Label}  from 'react-bootstrap';
import ReactDOM from 'react-dom';
import  * as Actions from '../../actions/Actions.es6';
import Constants from '../../constants/Contants.es6';
/*
  Renders a single Location 
  */
  class Item extends React.Component{

    constructor() {
      super();
    }

    _showLocationPopup(){
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'isCoded': true, 'locationFeature': this.props});//TODO make data conversion for infowindow
  }

  _showDataEntryForm(){
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'isCoded': true, 'locationFeature': this.props, 'activeDataentry': true});
  }

  render() {
    var status = !this.props.status ? 'Existing' : this.props.status;

    return (
      <div className="list-group-item">
        <h3 className="list-group-item-heading"><b>{this.props.name}</b></h3>

        <p className="list-group-item-text">
          <label>Designation</label> 
            {this.props.featureDesignation.code} - {this.props.featureDesignation.name}
        </p>
        <p className="list-group-item-text">
          <label>Activity Description</label> 
          
          {this.props.activityDescription}
        </p>
        <p className="list-group-item-text">
          <label>Type</label> 
          {this.props.locationClass.name}
        </p>

        <p className="list-group-item-text">
          <label>Exactness</label>
          {this.props.exactness.name}
        </p>
        <p className="list-group-item-text">
          <label>Geometry</label>
          {this.props.geometry.type} - {parseFloat(this.props.geometry.coordinates[0]).toFixed(5)}, {parseFloat(this.props.geometry.coordinates[0]).toFixed(5)}
        </p>
         <p className="list-group-item-text">
          <label className="inline">Status</label>
           <Label bsStyle={status=='DELETED'? 'danger' : status=='NEW'? 'success' : 'warning'}>{status}</Label>
       
        </p>
        <p className="list-group-item-text pull-right">
          <Button bsStyle='warning' className="show-location-button" bsSize="small" onClick={this._showDataEntryForm.bind(this)}>edit</Button>     
          <Button bsStyle='success' className="show-location-button" bsSize="small" onClick={this._showLocationPopup.bind(this)}>map it</Button>     
        </p>
              <br/>

      </div>
      )
}
}

/*
   This view renders the Project Information UI component
   */
   export default class ProjectDetails extends React.Component {

    constructor() {
      super();
    }

    render() {
      debugger;
     return (
         <div className=" list location-list">
        {this.props.locations? this.props.locations.map((item) =>{return  <Item key={item.id} {...item}/>}):null}
        </div>
        );
    } 
  }

