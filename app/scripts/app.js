require('../stylesheets/app.scss');
require('bootstrap/dist/css/bootstrap.css')
require("babel-polyfill");

import  Settings from  "./util/Settings.es6";
import  * as Actions from './actions/Actions.es6'
import { Router, Route, Link ,Redirect,IndexRoute } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import ProjectList  from './components/ProjectList.jsx'
import Header  from './components/Header.jsx';
import GridLayout from './components/Grid.jsx';
import FixedLayout from  './components/Fixed.jsx';

/*Global constants */
window.GEO_NAMES_SERVICE_USER_NAME = 'aiddata';
window.APP_SETTINGS = new Settings();
window.API_BASE_URL = 'http://localhost:3000';
window.PROJECT_LIST_URL = `${window.API_BASE_URL}/projects`;
window.PROJECT_URL = `${window.API_BASE_URL}/project`;


/**
 * Root view
 */
class App extends React.Component {
 render() {
    return (
      <div>
          <Header/>
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
    <Route path="/" component={ProjectList}>
      <IndexRoute component={ProjectList} />
    </Route>
  
    <Route path="/grid" component={App}>
      <Route path="map" component={GridLayout}/>
    </Route>
  
    <Route path="/fixed" component={App}>
      <Route path="map/:projectID" component={FixedLayout}/>
    </Route>
    
    <Route path="*" component={NoMatch}/>

 </Router>
), document.getElementById('root'))


