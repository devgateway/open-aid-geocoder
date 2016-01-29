
import React from 'react';
import ReactDOM from 'react-dom';
import {ListGroup,ListGroupItem,Pagination,Grid,Row,Col,Input,Button}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import Projects from '../stores/Projects.es6';



/* Renders a link to a specific project */
class ProjectLink extends React.Component {
  constructor() {
    super();
  }

  render() {
    
      return (
        <div className={(this.props.locations && this.props.locations.length>0)?"bs-callout bs-callout-success":"bs-callout bs-callout-info"}>
                      <div className="text-vertical">{this.props.project_id}</div>
                      <h4>{this.props.title} </h4>
                      <p>{this.props.long_description}</p>
                       
                       <p className="pull-right"> <Link to={"/fixed/map/" + this.props.project_id}>Open</Link></p>
                </div>
              
            )
    

      }
}

class ProjectList extends React.Component {

  constructor() {
    super();

    this.state = Projects.get();
  }
  
  componentDidMount() {  
  	this.unsuscribe=Projects.listen(this.onStoreChange.bind(this));
  }

  componentWillMount(){
    Actions.invoke(Constants.ACTION_FIND_PROJECTS,this.state.params);  
  }

  componentWillUnmount() {
  	this.unsuscribe()
  }

  onStoreChange(data){

    this.setState(data);
  }

  validationState() {
    debugger;
    let length = this.state.params.t?this.state.params.t.length:0;
    if (length > 3) return 'success';
    else if (length > 0) return 'warning';
    else if (length > 0) return 'error';
  }
  
  search(){
    Actions.invoke(Constants.ACTION_FIND_PROJECTS,this.state.params);
  }

  handlePageChanged(event,target){
    let page=target.eventKey; 
    Actions.invoke(Constants.ACTION_FIND_PROJECTS_SET_PAGE,page);
  }

  
  handleChange(event){
    let name=event.target.name;
    let value =event.target.value;
    let param={};
    param[name]=value;
    Actions.invoke(Constants.ACTION_FIND_PROJECTS_SET_PARAM,param);
  
  }

  render() {
    return (
              <Grid>
                <Row>
                  <Col>
                    <div className="">
                      <h1>Projects</h1>
                      
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>

                    <Input
                    type="text"
                    name="t"
                    value={this.state.value}
                    placeholder="Enter text to search"
                    label="Search"
                    bsStyle={this.validationState()}
                    hasFeedback
                    ref="input"
                    groupClassName="group-class"
                    labelClassName="label-class"
                    onChange={this.handleChange.bind(this)} />
                  </Col>
                </Row>
                <Row className="small">
                  <Col lg={12}>
                    <div className="form form-inline pull-rigth">
                      <div className="form-group">
                        <label>
                         Geocoding fiter 
                        </label>
                      </div>

                      <div className="form-group spacingLg">
                        <Input type="radio" name="withLoc" label="Ignore" value="none" checked={this.state.params.withLoc =='none'}  onChange={this.handleChange.bind(this)}/>
                      </div>


                      <div className="form-group spacingLg">
                        <Input type="radio" name="withLoc" label="Having" value="yes" checked={this.state.params.withLoc =='yes'}  onChange={this.handleChange.bind(this)}/>
                      </div>


                      <div className="form-group spacingLg">
                        <Input type="radio" name="withLoc" label="Not having "value="no" checked={this.state.params.withLoc =='no'}  onChange={this.handleChange.bind(this)}/>
                      </div>

                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <ListGroup>
                      {this.state.data.projects?this.state.data.projects.map((project) => { 
                      return <ProjectLink key={project._id} {...project}/>
                    }):null
                  }
                </ListGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="centerd">
                  <Pagination next={true}  prev={true} bsSize="small" items={this.state.pageCount} activePage={this.state.page} onSelect={this.handlePageChanged.bind(this)} />
                </div>
              </Col>
            </Row>
          </Grid>
    )
}
}


export default ProjectList