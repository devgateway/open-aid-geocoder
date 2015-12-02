require('../stylesheets/app.scss');
require('bootstrap/dist/css/bootstrap.css')
require("babel-polyfill");


window.GEO_NAMES_SERVICE_USER_NAME='aiddata';
window.Settings=new Settings()

import  Settings from  "./util/Settings.es6";
import  * as Actions from './actions/Actions.es6'
import { Router, Route, Link ,Redirect,IndexRoute } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import Projects  from './components/projects.jsx'
import {HeaderNavBar}  from './components/headerNavBar.jsx';

import GridLayout from './components/Grid.jsx';
import Fixedlayout from  './components/Fixed.jsx';
/**
 * Root view
 */
class App extends React.Component {
 render() {
    return (
      <div>
          <HeaderNavBar/>
          {this.props.children}
      </div>
    )
  }
}


/*
Not found view
 */
class NoMatch extends React.Component{
	render(){
		return <h1>Not found</h1>
	}
}


render((
  <Router>
    <Route path="/" component={Projects}>
      <IndexRoute component={Projects} />
    </Route>
  
    <Route path="/grid" component={App}>
      <Route path="map" component={GridLayout}/>
    </Route>
  
    <Route path="/fixed" component={App}>
      <Route path="map" component={Fixedlayout}/>
    </Route>
    
    <Route path="*" component={NoMatch}/>

 </Router>
), document.getElementById('root'))


