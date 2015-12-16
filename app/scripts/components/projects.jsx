
import React from 'react';

import ReactDOM from 'react-dom';

import {ListGroup,ListGroupItem,Pagination,Grid,Row,Col}  from 'react-bootstrap';

import { Link  } from 'react-router';

import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';

import ProjectStore from '../stores/ProjectStore.es6';

/* Renders a link to a specific project */
class ProjectLink extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() { }

  componentWillUnmount() {}

  render() {
    return (
		<ListGroupItem><Link to={"/fixed/map/" + this.props.id}>{this.props.title}</Link></ListGroupItem>       
    )
  }
}

class Projects extends React.Component {

  constructor() {
    super();
	this.loadProjects();
	this.store = ProjectStore;
	let data = (this.store.get()) ? this.store.get() : [];
    this.state = data;
  }
  
  componentDidMount() {  
  	this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
  	this.unsuscribe()
  }

  handleSelect(){
  }
  
  loadProjects() {
  	Actions.invoke(Constants.Project.ACTION_LOAD_ALL_PROJECTS);  
  }
  
  onStoreChange(data){
    this.setState(data);
  }

  render() {
    return (
      <Grid>
          <Row>
            <Col>
               <div className="bs-callout bs-callout-warning">
                  <h4>Project List</h4>
                  <p>Pick a project to start geocoding it.</p>
               </div>
            </Col>
            </Row>
            <Row>
            <Col>
              <ListGroup>
			  {
			  	this.state.projects.map((project) => { 
					return <ProjectLink key={project._id} id={(project.project_id).toString()} title={project.title}/>
				})
			  }
              </ListGroup>
            </Col>
            </Row>
            <Row>
            <Col>
               <Pagination bsSize="small" items={10} activePage={this.state.activePage} onSelect={this.handleSelect} />
            </Col>
          </Row>
        </Grid>
        )
  }
}


export default Projects