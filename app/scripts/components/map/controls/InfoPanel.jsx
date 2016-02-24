
import React from 'react';
import {Tabs, Tab, Button, Label}  from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import  * as Actions from '../../../actions/Actions.es6';
import Constants from '../../../constants/Contants.es6';
import ProjectStore from '../../../stores/Project.es6';
import LocationsStore from '../../../stores/Locations.es6';
import Results from '../../gazetteer/Results.jsx';
import ProjectInfoHelp from '../../../help/ProjectInfo.es6';
import ProjectDescription from '../../project/ProjectDescription.jsx';
import L from 'leaflet'; 
import Message from '../../Message.jsx';
import ProjectCoding from '../../project/ProjectCoding.jsx';
import LanStore from '../../../stores/LanStore.es6';

/*
   This view renders the info Ttab view UI component
   */
class InfoControl extends React.Component {

  constructor() {
    super();
    this.state = {expanded:true, project:{}, locationsCount: 0, showTab: 1};
  }

  componentWillMount() {
    this.unsuscribe = ProjectStore.listen(this.onStoreChange.bind(this));
    this.unsuscribe = LocationsStore.listen(this.onLocationsLoaded.bind(this));
    this.loadProject(this.props.id); //TODO:this can be triggered by an external event
    this.unsubscribe = LanStore.listen(this.changeLanguage.bind(this));
  }

  changeLanguage(lan){
    this.forceUpdate()
  }
  
  componentWillUnmount() {
    this.unsuscribe()
  }

  componentDidMount(){
    let container=ReactDOM.findDOMNode(this);
    L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
    L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
  }

  loadProject(id) {
    Actions.invoke(Constants.ACTION_LOAD_SINGLE_PROJECT, id);  
  }

  onLocationsLoaded(data){
    let newState=Object.assign({},this.state);
    if (data.loadingLocations){
      Object.assign(newState,{'showTab': 3}); //if hit load locations, then show the results tab
    }
    Object.assign(newState,{'locationsCount': data.locations.toJS().records.length});
    this.setState(newState);
  }

  handleSelect(key) {
    let newState=Object.assign({},this.state);
    Object.assign(newState,{'showTab': key});
    this.setState(newState);
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
    var activeTab = this.state.showTab || 1;
    return (    
      <div className="leaflet-control leaflet-control-layers" id="infoControl">
        {(!this.state.expanded)?<div className="control-info-toggle" title="Info Panel" onClick={this.toggle.bind(this)}></div>:
        <div id="project-info">
          <div className="panel panel-success">
            <div className="close-btn"  onClick={this.toggle.bind(this)}>
              <i className='fa fa-times-circle-o'></i>
            </div>
            <div className="panel-heading">

              <div className="options"> 
                <div className="header-icon"/>    
                <div className="small-title" >  
                  {this.state.project.project_id}
                </div>    
                <div className="separator"/>    
                <ProjectInfoHelp parentId="project-info"/> 
                <div className="separator"/> 
              </div>
              <div className="title">
                {this.state.project.title}
              </div> 

            </div>
            <div className="tab-container">
              <Tabs activeKey={activeTab} onSelect={this.handleSelect.bind(this)}>

                <Tab className="project-info" eventKey={1} title={Message.t('projectinfo.projectinfo')}>
                  <ProjectDescription  {...this.state.project}/>
                </Tab>
                <Tab eventKey={2} title={Message.t('projectinfo.geocoding') + " ("+(this.state.project.locations?this.state.project.locations.length:0)+")"}>
                  <ProjectCoding {...this.state.project}/>
                </Tab>

                <Tab eventKey={3} title={Message.t('projectinfo.gazetteerlocations') + " ("+(this.state.locationsCount)+")"}>
                  <Results/>
                </Tab>

              </Tabs>
            </div>
          </div>

        </div>} 
      </div>
    )
  }
}

export default InfoControl; 