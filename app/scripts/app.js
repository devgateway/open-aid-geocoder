require('../stylesheets/app.scss');
require('bootstrap/dist/css/bootstrap.css')
require("babel-polyfill");

import  Settings from  "./util/Settings.es6";

window.GEO_NAMES_SERVICE_USER_NAME='aiddata';

window.Settings=new Settings()

import { Router, Route, Link ,Redirect,IndexRoute } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import {Projects} from './components/projects.jsx'
import {MapView} from './components/map/Map.jsx'
import {HeaderNavBar}  from './components/headerNavBar.jsx';

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
    <Route path="/geocoding" component={App}>
      <Route path="map/:id" component={MapView}/>
      <Route path="*" component={NoMatch}/>
      <Redirect from="/" to="list" />
  
    </Route>

  </Router>
), document.getElementById('root'))


