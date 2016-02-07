
import React from 'react';
import {Tabs, Tab, Button, Label}  from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import  * as Actions from '../../../actions/Actions.es6';
import Constants from '../../../constants/Contants.es6';
import ProjectStore from '../../../stores/Project.es6';
import LocationsList from '../../search/Results.jsx';
import ProjectInfoHelp from '../../../help/ProjectInfo.es6';
import ProjectDetails from '../../project/ProjectDetails.jsx';

/*
   This view renders the info Ttab view UI component
*/
class ProjectInfo extends React.Component {

      constructor() {
        super();
        this.state={expanded:true,project:{}};
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
            <div className="leaflet-control leaflet-control-layers leaflet-control-layers-countries leaflet-control">
              {(!this.state.expanded)?<div className="leaflet-control-layers-toggle" title="Info Panel" onClick={this.toggle.bind(this)}></div>:
              <div id="project-info">
                <div className="panel panel-success">
                  <div className="close-btn"  onClick={this.toggle.bind(this)}>
                    <i className='fa fa-times-circle-o'></i>
                  </div>
                  <div className="panel-heading">

                    <div className="options"> 
                      <div className="small-title header-icon" >  
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
                    <Tabs defaultActiveKey={1}>

                      <Tab className="project-info" eventKey={1} title="Project Info">
                        <div className="panel-body list">
                          {this.state.project.long_description}

                          <p><label>Country</label> {this.state.project.country?this.state.project.country.name:'N/A'}</p>
                        </div>
                      </Tab>
                      <Tab eventKey={2} title="Geocoding">
                        <ProjectDetails {...this.state.project}/>
                      </Tab>

                      <Tab eventKey={3} title="Gazetteer Locations">
                        <LocationsList/>
                      </Tab>

                    </Tabs>
                  </div>
                </div>

              </div>} 
            </div>
          )


      }
}

export default ProjectInfo 