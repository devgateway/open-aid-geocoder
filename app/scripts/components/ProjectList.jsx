
import React from 'react';
import ReactDOM from 'react-dom';
import {ListGroup,ListGroupItem,Pagination,Grid,Row,Col}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import ProjectListStore from '../stores/ProjectListStore.es6';

/* Renders a link to a specific project */
class ProjectLink extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() { }

  componentWillUnmount() {}

  render() {
    //TODO:Extract URL into a variable
    if (this.props.locations && this.props.locations.length>0){
      return (<ListGroupItem bsStyle="success"><Link to={"/fixed/map/" + this.props.project_id}>{this.props.title}</Link></ListGroupItem>)
    } else {
      return (<ListGroupItem><Link to={"/fixed/map/" + this.props.project_id}>{this.props.title}</Link></ListGroupItem>)
    }
  }
}

class Projects extends React.Component {

  constructor() {
    super();
    this.loadProjects();
    this.store = ProjectListStore;
    let data = (this.store.get()) ? this.store.get() : [];
    this.state = data;
  }
  
  componentDidMount() {  
  	this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
  	this.unsuscribe()
  }

  loadProjects() {
  	Actions.invoke(Constants.ACTION_LOAD_ALL_PROJECTS);  
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
                      {this.state.projects.map((project) => { 
                          return <ProjectLink key={project._id} {...project}/>
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