import React from 'react';
import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';
import {LocationsSearch} from './LocationsSearch.jsx';
import { Link  } from 'react-router';
import Message from './Message.jsx';
import * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import LanStore from '../stores/LanStore.es6';

export default class Header extends React.Component {
  
  constructor() {
    super();
    this.state = LanStore.get();
  }

  changeLan(evt){
   let lan=evt.target.value;
   Actions.invoke(Constants.ACTION_CHANGE_LANGUAGE,lan);
 }

 componentDidMount() {
  this.unsubscribe = LanStore.listen(this.changeLanguage.bind(this));
}

componentWillUnmount() {
  this.unsubscribe();
}

changeLanguage(lan){
  this.setState(lan)
}


render() {
  console.log(this.state.lan)
  return (
    <div className="header">
    
    <nav className="navbar navbar-default">
    <div className="container-fluid">
    
    <div className="navbar-header">
    <Message className="navbar-brand"  k="header.branding"/>
    </div>

    <div className="nav navbar-left">
    
    <LocationsSearch/>
    </div>
    

    <ul className="nav navbar-nav navbar-right ">
    <NavDropdown eventKey={4} title={Message.t('header.options.label')} id="nav-dropdown">
    <li>
    <p>
    <i className="fa fa-cog"></i> Language 
    <select  value={this.state.lan} name="lan" className="pull-right" onChange={this.changeLan}>
    <option value="en">English</option>
    <option value="es">Espa&ntilde;ol</option>
    </select>
    </p>
    </li>
    <MenuItem eventKey="4.2"><i className="fa fa-cog"></i> Auto Zoom <input type="checkbox"/></MenuItem>
    <MenuItem eventKey="4.2"><i className="fa fa-cog"></i> Auto Clean Locations <i className="fa fa-check"></i></MenuItem>
    </NavDropdown>
    
    </ul>
    </div>
    </nav>
    {this.props.children}
    </div>
    )
}
}

