require('../stylesheets/app.scss');
require('bootstrap/dist/css/bootstrap.css')


import { Router, Route, Link } from 'react-router'
import React from 'react';
import { render } from 'react-dom';
import {Map} from './components/map.jsx'

class App extends React.Component {
  render() {
    return (
      <div>
        <p>
         Landing Page of Geocoding tool.
        </p>
        <ol>
          <li><Link to="/list" activeClassName="active">Pick a project</Link></li>
          <li><Link to="/map" activeClassName="active">Open Empty Map</Link></li>
          <li><Link to="/forgot-password" activeClassName="active">Leave the page</Link></li>
        </ol>
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
      <Route path="map" component={Map}/>
       <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))


