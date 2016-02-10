
import React from 'react';
import ReactDOM from 'react-dom';
import {ListGroup,ListGroupItem,Pagination,Grid,Row,Col,Input,Button}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../../actions/Actions.es6';
import Constants from '../../constants/Contants.es6';
import Projects from '../../stores/Projects.es6';
import Message from '../Message.jsx';
/* Renders a quick project info view */

class ProjectInfo extends React.Component {
  
  constructor() {
    super();
  }
  
  render() {
    return (
      <div className={(this.props.locations && this.props.locations.length>0)?'bs-callout bs-callout-success':'bs-callout bs-callout-info'}>
        <div className="text-vertical">{this.props.project_id}</div>
        <h3><Link to={'map/'+this.props.project_id}>{this.props.title}</Link> </h3>
        <p>
          {this.props.long_description}  
        </p>
        <div className="pull-right"> <Link to={'map/' + this.props.project_id}><Message k="projectlist.geocodeproject"/></Link></div>
        <br/>        
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
              <h1>Projects</h1>
          </Col>
        </Row>
        <div id="project-search-form"> 
          <Row>
            <Col lg={12}>
              <Input  type="text"
              name="t"
              value={this.state.value}
              placeholder="Enter text to search"
              label="Text search"
              // bsStyle={this.validationState()}
              hasFeedback
              ref="input"
              groupClassName="group-class"
              labelClassName="label-class"
              onChange={this.handleChange.bind(this)} />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="form form-inline pull-rigth">
                <label>
                  <Message k="projectlist.geocodingfilter"/>  
                </label>
                <div className="form-group spacingLg">
                  <Input className="radio-inline" type="radio" name="withLoc" label={Message.t('projectlist.havelocations')} value="yes" checked={this.state.params.withLoc =='yes'}  onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="form-group spacingLg">
                  <Input className="radio-inline" type="radio" name="withLoc" label={Message.t('projectlist.nothavelocations')} value="no" checked={this.state.params.withLoc =='no'}  onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="form-group spacingLg">
                  <Input className="radio-inline" type="radio" name="withLoc" label={Message.t('projectlist.any')} value="none" checked={this.state.params.withLoc =='none'}  onChange={this.handleChange.bind(this)}/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Row id="project-search-list">
          <Col lg={12}>
            <ListGroup>
              <h4> <Message k="projects.projectsCount" count={this.state.data.count}/> </h4> 
              {this.state.data.projects?this.state.data.projects.map((project) => { 
                  return <ProjectInfo key={project._id} {...project}/>
                }):null
              }
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col className="centered">
              <Pagination next={true}  prev={true} bsSize="small" items={this.state.pageCount} activePage={this.state.page} onSelect={this.handlePageChanged.bind(this)} />
          </Col>
        </Row>
      </Grid>
    )
  }
}


export default ProjectList