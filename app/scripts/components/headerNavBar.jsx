import React from 'react';
import { render } from 'react-dom';

import {Navbar,Nav,NavDropdown,MenuItem,NavBrand,NavItem}  from 'react-bootstrap';

class HeaderNavBar extends React.Component {
  
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Navbar>
           <NavBrand><a href="#">Open Geocoder</a></NavBrand>
          <Nav>
            <NavItem eventKey={2} href="#">Home</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey="1">Action</MenuItem>
              <MenuItem eventKey="2">Another action</MenuItem>
              <MenuItem eventKey="3">Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4">Separated link</MenuItem>
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