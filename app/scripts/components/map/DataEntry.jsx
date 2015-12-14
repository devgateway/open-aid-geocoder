require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {Button,Input,ButtonInput} from 'react-bootstrap';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';

/**/
export default class DataEntry extends React.Component {
   static propTypes = {}
 
   constructor(props) {
     super(props);
     this.displayName ='Data Entry';
   }
  
  render() {
    debugger;
     return (
        <div className="dataEntry" >
        <h4>Geocode location</h4>
              <form className="">
              <div className="form-group">
                <label  for="name">Name</label>
                <input type="text" className="form-control" id="name" placeholder="name" value={this.props.name} disabled/>

                </div>
                
                <div className="row"> 
                    <div className="col-lg-4">
                     <div className="form-group">
                      <label  for="geonameId,">Identifier</label>
                      <input type="text" className="form-control" id="geonameId," value={this.props.geonameId}/>
                    </div>
                  </div>
                
                  <div className="col-lg-3">
                     <div className="form-group">
                      <label  for="lat">Latitude</label>
                      
                      <input type="text" className="form-control" id="latitude" value={this.props.lat}/>
                    </div>
                  </div>
                  <div className="col-lg-4">
                     <div className="form-group">
                      <label  for="lng">Longitude</label>
                      <input type="text" className="form-control" id="longitude" value={this.props.lng}/>
                    </div>
                  </div>
              </div>

                <div className="row"> 
                    <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="admin1">Admin1</label>
                      <input type="text" className="form-control" id="admin1" value={this.props.admin1}/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="admin2">Admin2</label>
                      <input type="text" className="form-control" id="admin2" value={this.props.admin2}/>
                    </div>
                  </div>
              </div>
              
                  <div className="row"> 
                    <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="typeCode">Type Code</label>
                      <input type="text" className="form-control" id="typeCode" vale={this.props.fcode}/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="typeDescription">Type description</label>
                      <input type="text" className="form-control" id="typeDescription" vale={this.props.fcodeName}/>
                    </div>
                  </div>
              </div>
          
          <div className="row"> 
                    <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="locationClass">Location Class</label>
                      <input type="text" className="form-control" id="locationClass" vale={this.props.locationClass}/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="form-group">
                      <label  for="exactness">Geographic Exactness  </label>
                      <input type="text" className="form-control" id="exactness" vale={this.props.exactness}/>
                    </div>
                  </div>
              </div>
               <div className="row"> 
                <div className="col-lg-12"> 
                  <button className="btn btn-success pull-right">Save</button>
                </div>
              </div>
            </form>
        </div>
     );
   }

}