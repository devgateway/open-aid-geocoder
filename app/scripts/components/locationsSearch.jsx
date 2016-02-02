import {Input,Button,Grid,Row,Col}  from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react';
import {NavDropdown,MenuItem}  from 'react-bootstrap';
import  * as Actions from '../actions/Actions.es6'
import LocationsStore from '../stores/Locations.es6';
import SingleProjectStore from '../stores/Project.es6';
import Constants from '../constants/Contants.es6';
import * as Intro from 'intro.js'
import Message from './Message.jsx'



let LocationsSearch = React.createClass({ 

  getInitialState() {
    return {'fuzzy':false,'country':false,'text':''}
    this.onStoreChange = this.onStoreChange.bind(this);
  },

  componentDidMount() {
    LocationsStore.listen(this.onStoreChange);
    SingleProjectStore.listen(this.getCountry);
  },

  componentWillUnmount() {
       // LocationsStore.unlisten(this.onStoreChange);
     },

     onStoreChange(){
      console.log('Store changed ..');
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


  help() {
    let node=ReactDOM.findDOMNode(this);
    
    let intro=Intro.introJs();

    intro.setOptions({steps:[
      {
        element: node,
        intro: Message.t("help.header.textinput")
      },

      {
        element: node.querySelector("input[name=fuzzy]"),
        intro: Message.t("help.header.fuzzycheck"),
        position: 'left'
      },
      {
        element: node.querySelector("input[name=country]"),
        intro: Message.t("help.header.countrycheck")
      },
      {
        element: node.querySelector(".btn-search"),
        intro: Message.t("help.header.searchbtn")
      }      
    ]});
    intro.start()
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
     <div className="navbar-form navbar-left small" role="search">
       <div className="form-group">
       
        <label className="small spacing" ><Message k="header.search.label"/></label> 

       
         <Input  type="text" value={this.state.text} 
         placeholder={Message.t("header.search.holder")} 
         bsStyle={this.validationState() } 
         hasFeedback bsSize="small" 
         ref="text" 
         className="spacing"
         groupClassName="group-class" 
         labelClassName="label-class" 
         onChange={this.handleChange}
         onKeyDown={this.handleKey}/>
       </div>

       <div className="form-group small">
         <input type="checkbox"  name="fuzzy"  className="spacing"    checked={this.state.fuzzy} onChange={this.handleChange}/> 
         <Message k="header.search.fuzzy"/>
       </div>
       <div className="form-group small"> {' '}
         <input type="checkbox"  name="country"  className="spacing"  checked={this.state.country} onChange={this.handleChange}/> 
           
           <Message k="header.search.country"/>
       
       </div>

       <div className="form-group small">
         <Button className="spacing btn-search" bsStyle="success" bsSize="xsmall" onClick={this.doSearch}>
           <Message k="header.search.submit"/>
         </Button>
       </div>

       <div className="form-group small" > {' '}
         <Button className="spacing help" bsStyle="info" bsSize="xsmall" onClick={this.help}><i className="fa fa-question-circle"></i></Button>
       </div>

     </div>
     )
}
})

export {LocationsSearch}