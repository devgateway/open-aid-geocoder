import React from 'react';
import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';
import {LocationsSearch} from './LocationsSearch.jsx';
import LayerSelectors from './map/CountryLayerSelector.jsx';
import { Link  } from 'react-router';
import AppIntro from './AppIntro.jsx';

 /**
  * 
  */
export default class Header extends React.Component {
  
  constructor() {
    super();
  }

  render() {
    return (
        <div className="header">
        
          <nav className="navbar navbar-default">
            <div className="container-fluid">
            
              <div className="navbar-header">
                <span className="navbar-brand" >Open Aid Geocoder</span>
              </div>

              <div className="nav navbar-left">
           
                <LocationsSearch/>
              </div>
 

                <ul className="nav navbar-nav navbar-right ">
                    <NavDropdown eventKey={4} title="Options" id="nav-dropdown">
                    <LayerSelectors/>
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

