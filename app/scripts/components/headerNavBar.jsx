import React from 'react';

import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';

import {LocationsSearch} from './LocationsSearch.jsx';

class HeaderNavBar extends React.Component {
  
  constructor() {
    super();
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Open Geocoder</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                  <li><a href="#">Link</a></li>
                  <li><a href="#">Link</a></li>
                </ul>
               <LocationsSearch/>
                <ul className="nav navbar-nav navbar-right">
                    <NavDropdown eventKey={4} title="Options" id="nav-dropdown">
                    <MenuItem eventKey="4.2">Auto Zoom <input type="checkbox"/></MenuItem>
                    <MenuItem eventKey="4.2">Auto Clean Locations <i className="fa fa-check"></i></MenuItem>
                    <MenuItem eventKey="4.3">Cler Locations</MenuItem>
                    <MenuItem eventKey="4.3">TEST</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey="4.4">Separated link</MenuItem>
                  </NavDropdown>
                 
                </ul>
              </div>
            </div>
          </nav>
          {this.props.children}
        </div>
    )
  }
}

export {
  HeaderNavBar
}