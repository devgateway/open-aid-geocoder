

require('bootstrap/dist/css/bootstrap.css')
require('intro.js/introjs.css');
require('../stylesheets/app.scss');
require('../stylesheets/control.layers.minimap.css');
require("babel-polyfill");
require('font-awesome/css/font-awesome.css');



import  Settings from  "./util/Settings.es6";
import  * as Actions from './actions/Actions.es6'
import { Router, Route, Link ,Redirect,IndexRoute } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import ProjectList  from './components/ProjectList.jsx'
import Header  from './components/Header.jsx';
import GridLayout from './components/Grid.jsx';
import FixedLayout from  './components/Fixed.jsx';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { hashHistory } from 'react-router'

console.log(window.ENV);

let settings=Settings.getInstace()

/**
 * Root view
 */
 class App extends React.Component {
   render() {
    return (
      <div className="app">
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



i18next.use(XHR).init({
    'lng': settings.get('I18N','DEAULT_LNG'),
    "fallbackLng": settings.get('I18N','FALLBACK_LNG'),
    "ns": [
      settings.get('I18N','DEAULT_NS')
    ],
    "defaultNS":   settings.get('I18N','DEAULT_NS'),
    "fallbackNS":  settings.get('I18N','FALLBACK_NS'),
    "backend": {
      "loadPath": settings.get('I18N','LOCALES_PATH')
    }
  }, (err, t) => {
  

  render((
    <Router history={hashHistory} >
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


});




