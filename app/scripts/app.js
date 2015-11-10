require('../stylesheets/app.scss');
require('bootstrap/dist/css/bootstrap.css')
import { Router, Route, Link } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import {Geocoding} from './components/geocoding.jsx'

import {HeaderNavBar}  from './components/headerNavBar.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
      Header
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
    <Route path="/" component={App}>
      <Route path="geocoding" component={Geocoding}/>
       <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))


