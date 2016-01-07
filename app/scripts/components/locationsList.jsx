
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import LocationsStore from '../stores/Locations.es6';
import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {Button}  from 'react-bootstrap';

/*
  Renders a single Location 
*/
class Item extends React.Component{

  constructor() {
    super();
  }

  componentDidMount() { }

  componentWillUnmount() {}
  
  setActiveLocation(data) {
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'locationFeature': data});	
  }

  render() {
    return (
        <div className="list-group-item">
          <Button bsStyle='success' className="show-location-button" bsSize="xsmall" onClick={this.setActiveLocation.bind(this, this.props)}>Map it</Button>
          <a><h4 className="list-group-item-heading">{this.props.name}</h4></a>
          <h5><b>{this.props.countryName}</b></h5>
          <p className="list-group-item-text">{this.props.fclName}</p>
          <p className="list-group-item-text">{this.props.fcodeName}</p>
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

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    if(!this.props.records || this.props.records.length == 0) {
    	return (
  		  <h4> No location results found. </h4>
  	  )
    } else {
    	return (
  	    <div className="list-group location-list">
    		{
      		this.props.records.map((item) => {
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
class LocationsList extends React.Component {

    constructor() {
      super();
      this.store=LocationsStore;
      let data=(this.store.get())?this.store.get().toJS():[]
      this.state=data
    }

    componentDidMount() {

     this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  
    }

    componentWillUnmount() {
      this.unsuscribe()
    }

    onStoreChange(data){
      this.setState(data.toJS())
    }

    render() {
    return (
			<div className="panel-body list">
	 	    <ListItems {...this.state}/>
      </div>
		)
  }
}


export default LocationsList  //TODO: rename maybe 