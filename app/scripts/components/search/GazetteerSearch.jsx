import {Input,Button}  from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react';
import {NavDropdown,MenuItem}  from 'react-bootstrap';
import  * as Actions from '../../actions/Actions.es6'
import LocationsStore from '../../stores/Locations.es6';
import SingleProjectStore from '../../stores/Project.es6';
import Constants from '../../constants/Contants.es6';
import * as Intro from 'intro.js'
import Message from '../Message.jsx'
import Help from '../../help/LocationsSearch.es6';

const GazetteerSearch = React.createClass({ 

    getInitialState() {
      return {'fuzzy':false,'country':false,'text':''}
    },

    componentDidMount() {
      //LocationsStore.listen(this.onStoreChange); //TODO:maybe we can show a message when there are no resutls 
      SingleProjectStore.listen(this.getCountry); //TODO:we need the country to use the country filter anyway it can be removed from here and makes the stores listen btween each other
    },

      onStatusChange(status) {
        this.setState({currentStatus: status});
      },

      getCountry(project) {
        let countryISO = project.country?project.country.iso2:null;
        if(countryISO){
         let newState = Object.assign(this.state, { countryISO });
       }
     },
     
     doSearch(){
      Actions.invoke(Constants.ACTION_SEARCH_LOCATIONS,this.state)
    },

    handleChange(e) {
      let fuzzy=(e.target.name=='fuzzy')?!this.state.fuzzy:this.state.fuzzy;
      let country=(e.target.name=='country')?!this.state.country:this.state.country;
      let text=this.refs.text.getValue();
      let newState=Object.assign(this.state, {text,fuzzy,country});
      this.setState(newState);
    },

    handleKey(e) {
      if(e.keyCode == 13){
        this.doSearch();
      }
    },

    validationState() {
      console.log('Validations');

      let length = this.state.text.length;
      if (length > 3) return 'success';
      else if (length > 0) return 'error';

    },

  render() {

   return (
    <div id="gazetteer-search" className="navbar-form navbar-left" role="search">
     <div className="form-group">
          <Help parentId="gazetteer-search"/>
     </div>
   
     <div className="form-group">
      <div className="separator"/>
     </div>

     <div className="form-group">
        <Input  type="text" value={this.state.text}  placeholder={Message.t('header.search.holder')}  bsStyle={this.validationState() }   bsSize="small"  ref="text"   onChange={this.handleChange} onKeyDown={this.handleKey}/>
     </div>

     <div className="form-group">
     <div className="middle">
       <input type="checkbox"  id="fuzzy" name="fuzzy"      checked={this.state.fuzzy} onChange={this.handleChange}/> 
        <label htmlFor="fuzzy"><Message k="header.search.fuzzy"/></label>
     </div>
     </div>

     <div className="form-group">
       <div className="middle">
       <input type="checkbox" id="country"  name="country"   checked={this.state.country} onChange={this.handleChange}/> 
       <label htmlFor="country">  <Message k="header.search.country"/></label>
      </div>
       </div>

     <div className="form-group small">
       <Button className="btn-search wide" bsStyle="success" bsSize="small" onClick={this.doSearch}> <Message k="header.search.submit"/> </Button>
     </div>
    </div>
     )
}
})

export default GazetteerSearch