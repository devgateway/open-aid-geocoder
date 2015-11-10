
import React from 'react';
import ReactDOM from 'react-dom';

import {ListGroup,ListGroupItem,Pagination,Grid,Row,Col}  from 'react-bootstrap';
import { Link  } from 'react-router'

class Projects extends React.Component {

  constructor() {
    super();
    this.state = {data: ""}
  }

  handleSelect(){

  }

  render() {
    return (
      <Grid>
      <Row>
        <Col>
           <div className="bs-callout bs-callout-warning">
           <h4>Mock project list</h4>
            <p>Pick a project to start geocoding it, TODO: It should load a list of projects from an end-point or this page should be provided by the host system </p>
          </div>
        </Col>
        </Row>
      <Row>
        <Col>
        

        <ListGroup>
          <ListGroupItem><Link to="/geocoding/map/1">Upper Helmand Valley Development Road</Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Fertilizer and Agrochemicals Storage Project</Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Seraj Agricultural Development</Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Regional Power Transmission Interconnection</Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Gawargan and Charddarah Agricultural Development Project</Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Sectoral Planning Study of Afghan Agriculture </Link></ListGroupItem>
          <ListGroupItem><Link to="/geocoding/map/1">Kajakai Gate Project Preparation and Preliminary Assessment of Flood Control Scheme in the Lower Helmand Valley</Link></ListGroupItem>

        </ListGroup>
        </Col>
        </Row>
<Row>
        <Col>
            
           <Pagination
          bsSize="small"
          items={10}
          activePage={this.state.activePage}
          onSelect={this.handleSelect} />
  </Col>
        </Row>
      
        </Grid>
        )
  }
}

export { Projects }