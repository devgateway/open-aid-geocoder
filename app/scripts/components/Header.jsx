import React from 'react';
import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';
import GazetteerSearch from  './search/GazetteerSearch.jsx';
import { Link  } from 'react-router';
import Message from './Message.jsx';
import * as Actions from '../actions/Actions.es6';
import Constants from '../constants/Contants.es6';
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
              <div className="separator"/>
            </div>

            <div className="nav navbar-left">
              <GazetteerSearch/>
            </div>            
          </div>
        </nav>
      </div>
    )
  }
}
