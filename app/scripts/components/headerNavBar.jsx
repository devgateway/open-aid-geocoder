import React from 'react';

import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';

import {Gazetteer} from './gazetteer.jsx';

class HeaderNavBar extends React.Component {
  
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Navbar>
           <NavBrand><a href="#">Open Geocoder</a></NavBrand>
          <Nav right>
            <NavItem eventKey={2} href="#">Home</NavItem>
            <NavItem  eventKey={3}><Gazetteer/></NavItem>
            <NavDropdown eventKey={4} title="Menu" id="basic-nav-dropdown">
              <MenuItem eventKey="1"></MenuItem>
              <MenuItem eventKey="2">Auto Zoom</MenuItem>
              <MenuItem eventKey="3">User Guide</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4">About</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>
          {this.props.children}
      </div>
    )
  }
}

export {
  HeaderNavBar
}