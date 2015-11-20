import {Input,Button,Grid,Row,Col}  from 'react-bootstrap';
import React from 'react'
import {NavDropdown,MenuItem}  from 'react-bootstrap';


import  {actionsCaller} from '../actions/actions.es6'

import {LocationsStore} from '../stores/locations.es6';

import * as constants from '../constants/contants.es6';


let LocationsSearch = React.createClass({ 
    
      getInitialState() {
        return {'fuzzy':false,'country':false,'text':''}
        this.onStoreChange = this.onStoreChange.bind(this);
      },

      componentDidMount() {
        LocationsStore.listen(this.onStoreChange);
      },

      componentWillUnmount() {
        LocationsStore.unlisten(this.onStoreChange);
      },

      onStoreChange(){
        console.log('Store changed ..');
      },

      onStatusChange(status) {
        this.setState({currentStatus: status});
      },


      doSearch(){
        actionsCaller(constants.ACTION_SEARCH_LOCATIONS,this.state)
      },


      handleChange(e) {
        let fuzzy=(e.target.name=='fuzzy')?!this.state.fuzzy:this.state.fuzzy;
        let country=(e.target.name=='country')?!this.state.country:this.state.country;
        let text=this.refs.text.getValue();
        let newState=Object.assign(this.state, {text,fuzzy,country});
        this.setState(newState);
      },

      validationState() {
        console.log('Validations');

        let length = this.state.text.length;
        if (length > 3) return 'success';
        else if (length > 0) return 'error';

      },

      render() {
       var selector=(  
             <ul   className="nav navbar-nav navbar-right">
             <NavDropdown eventKey={1} title="Search" id="nav-dropdown">
              <MenuItem eventKey="1.1">Geonames</MenuItem>
              <MenuItem eventKey="1.2">Esri Geocoding</MenuItem>
              <MenuItem eventKey="1.3">Custom Gazzetter</MenuItem>
              <MenuItem divider />
            </NavDropdown>
            </ul>
          ) //TODO:this can be a child component is added here just for mocking purpose 

        return (
           <form className="navbar-form navbar-left" role="search">
            <div className="form-group">
              <Input    
                  
                      type="text" 
                      value={this.state.text} 
                      placeholder="Enter text to search" 
                      bsStyle={this.validationState() } 
                      hasFeedback bsSize="small" 
                      ref="text" 
                      groupClassName="group-class" 
                      labelClassName="label-class" 
                      onChange={this.handleChange}/>
            </div>
            <div className="form-group">
                  <Button className="spacing" bsStyle="success" bsSize="xsmall" onClick={this.doSearch}>Search</Button>
            </div>
            <div className="form-group">
                <input type="checkbox"  name="fuzzy"  className="spacing"    checked={this.state.fuzzy} onChange={this.handleChange}/> Fuzzy 
            </div>
            <div className="form-group"> {' '}
               <input type="checkbox"  name="country"  className="spacing"  checked={this.state.country} onChange={this.handleChange}/> Country
            </div>
          </form>)
    }
})

export {LocationsSearch}