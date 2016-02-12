
import React from 'react';
import ReactDOM from 'react-dom';

import LocationsStore from '../../stores/Locations.es6';
import * as Actions from '../../actions/Actions.es6';
import Constants from '../../constants/Contants.es6';
import {Button}  from 'react-bootstrap';
import Message from '../Message.jsx';

  /*
  Renders a single Location 
  */
class Item extends React.Component{

  constructor() {
    super();
  }

  setActiveLocation(data) {
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'locationFeature': data});	
  }

  render() {
    return (
      <div className="list-group-item">
        <Button className="pull-right" bsStyle='success' bsSize="small" onClick={this.setActiveLocation.bind(this, this.props)}><Message k="projectinfo.locationslist.mapit"/></Button>
        <p className="list-group-item-text">
          <label className='green text-large inline'>{this.props.name}:</label> {this.props.countryName}
        </p>       
        <p className="list-group-item-text">
          {this.props.fclName} {this.props.fcodeName}
        </p>   
      </div>
    )
  }
}

/*
Renders a  List of locations  
*/
class ListItems extends React.Component{
  
  constructor() {
    super();
  }
  
  render() {
    if(!this.props.records || this.props.records.length == 0) {
      return (
        <h4> No location results found. </h4>
      )
    } else {
      return (
        <div className="list-group">
          {this.props.records.map((item) => {
        		return <Item   key={item.geonameId} {...item}/>}) //TODO: we should define another way to obtain the object key in order to support different sources maybe a hashcode 
          }
        </div>
      )
    }	
  }
}

  

/*
This view renders  the Gazzetter Results 
*/
class Results extends React.Component {

  constructor() {
    super();
    this.store = LocationsStore;
    let data = (this.store.get().locations) ? this.store.get().locations.toJS() : null;
    this.state = data;
  }

  componentDidMount() {
    this.unsuscribe = this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsuscribe()
  }

  onStoreChange(data) {
    this.setState(data.locations.toJS())
  }

  typefilter(e) {
    Actions.invoke(Constants.ACTION_FILTER_BY_TYPE,e.target.value)
  }

  render() {
    return (
    <div id="search-results">
      <div className="form">
        <div className="form-group form-sm">
          <label className="bolder"><Message k="projectinfo.locationtype"/>:</label>
            <select name="typeFilter" className="large-input  form-control" onChange={this.typefilter.bind(this)} value={this.state.typefilter}>
              <option value='ALL'>All Types</option> 
              {this.state.types.map((t)=>{return <option key={t.code} value={t.code}>{t.name}</option>})}
            </select>
          </div>  
      </div>
      <ListItems {...this.state}/>
    </div>
      )
  }
}


export default Results //TODO: rename maybe 