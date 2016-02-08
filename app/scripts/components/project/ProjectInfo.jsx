
import React from 'react';
import {Tabs, Tab, Button, Label}  from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import  * as Actions from '../../actions/Actions.es6';
import Constants from '../../constants/Contants.es6';
import ProjectStore from '../../stores/Project.es6';
import LocationsList from '../search/Results.jsx';
import ProjectInfoHelp from '../../help/ProjectInfo.es6';
import Message from '../Message.jsx';
/*
  Renders a single Location 
  */
class Item extends React.Component{

  constructor() {
    super();
  }

  _showLocationPopup(){
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'isCoded': true, 'locationFeature': this.props});//TODO make data conversion for infowindow
  }

  _showDataEntryForm(){
    Actions.invoke(Constants.ACTION_SET_ACTIVE_LOCATION, {'isCoded': true, 'locationFeature': this.props, 'activeDataentry': true});
  }

  render() {
    var status = this.props.status=='EXISTING' ? '' : this.props.status;
    let statusLabel = 'NEW';
    switch(status) {
      case 'EDITED':
        statusLabel = Message.t('projectinfo.locationstatus.edited');
        break;
      case 'DELETED':
        statusLabel = Message.t('projectinfo.locationstatus.deleted');
        break;
    }
    return (
      <div className="list-group-item">
        <div className="row small pull-right">
          <div className="col-lg-8">
            <Button bsStyle='warning' className="show-location-button" bsSize="xsmall" onClick={this._showDataEntryForm.bind(this)}><Message k="projectinfo.locationslist.edit"/></Button>			
          </div>
          <div className="col-lg-4">
            <Button bsStyle='success' className="show-location-button" bsSize="xsmall" onClick={this._showLocationPopup.bind(this)}><Message k="projectinfo.locationslist.mapit"/></Button>			
          </div>
        </div>
        <h4 className="list-group-item-heading">{this.props.name}</h4>

        <p className="list-group-item-text">
          {this.props.featureDesignation.code} - {this.props.featureDesignation.name}
        </p>
        <p className="list-group-item-text">
          {this.props.activityDescription}
        </p>
        <p className="list-group-item-text">
          {this.props.locationClass.name}
        </p>
        <p className="list-group-item-text">
          {this.props.exactness.name}
        </p>
        <p className="list-group-item-text">
          {this.props.geometry.type} - {this.props.geometry.coordinates[0]}, {this.props.geometry.coordinates[0]}
        </p>
        <Label bsStyle={status=='DELETED'? 'danger' : status=='NEW'? 'success' : 'warning'}>{statusLabel}</Label>
      </div>
    )
  }
}

/*
   This view renders the Project Information UI component
   */
class ProjectInfo extends React.Component {

  constructor() {
    super();
    this.state={expanded:true};
  }

  componentWillMount() {
    this.unsuscribe=ProjectStore.listen(this.onStoreChange.bind(this));
    this.loadProject(this.props.id); //TODO:this can be triggered by an external event
  }

  componentWillUnmount() {
    this.unsuscribe()
  }

  loadProject(id) {
    Actions.invoke(Constants.ACTION_LOAD_SINGLE_PROJECT, id);  
  }

  onStoreChange(project){
    let newState=Object.assign({},this.state);
    Object.assign(newState,{project})
    this.setState(newState);
  }

  toggle(){
    let newState=Object.assign({},this.state);
    Object.assign(newState,{expanded:!newState.expanded})
    this.setState(newState);
  }

  render() {
    return (    
      <div className="leaflet-control">
      
        {(!this.state.expanded)?<div className="control-info-toggle" title="Info Panel" onClick={this.toggle.bind(this)}></div>:
        <div id="project-info">
          <div className="panel panel-success">
            <div className="panel-heading  handle">
              <h4>
                {this.state.project.project_id} - {this.state.project.title}   
                <ProjectInfoHelp parentId="project-info"/>
              </h4>
              <a className='close-dialog pull-right' href="javascript:void()" onClick={this.toggle.bind(this)}><i className='fa fa-times-circle-o'></i></a>
            </div>
            <Tabs defaultActiveKey={1}>
              <Tab className="project-info" eventKey={1} title={Message.t('projectinfo.projectinfo')}>
                <div className="panel-body list">
                  {this.state.project.long_description}
                  <p><label><Message k="projectinfo.country"/></label> {this.state.project.country?this.state.project.country.name:'N/A'}</p>
                </div>
              </Tab>
              <Tab eventKey={2} title={Message.t('projectinfo.geocoding')}>
                <div className="panel-body list location-list">
                  {
                  this.state.project.locations?
                  this.state.project.locations.map((item) => {
                  if(item.status != 'LOCATION') 
                  return <Item key={item.id} {...item}/>})
                  : <h4> <Message k="projectinfo.nogeocodingdata"/> </h4>
                  }
                </div>
              </Tab>
              <Tab eventKey={3} title={Message.t('projectinfo.gazetteerlocations')}>
                <LocationsList/>
              </Tab>
            </Tabs>
          </div>
        </div>} 
      </div>
    )
  }
}

export default ProjectInfo