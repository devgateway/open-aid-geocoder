
import React from 'react';
import {Tabs, Tab, Button, Label}  from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import ProjectStore from '../stores/Project.es6';
import LocationsList from './LocationsList.jsx';


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
     Actions.invoke(Constants.ACTION_OPEN_DATAENTRY_POPUP, this.props);
  }

  render() {
    var status = this.props.status=="EXISTING" ? "" : this.props.status;

  	return (
       	<div className="list-group-item">
       		
       		<div className="row small pull-right">
				
       			<div className="col-lg-8">
       				<Button bsStyle='warning' className="show-location-button" bsSize="xsmall" onClick={this._showDataEntryForm.bind(this)}>Edit</Button>			
       			</div>
       			<div className="col-lg-4">
       				<Button bsStyle='success' className="show-location-button" bsSize="xsmall" onClick={this._showLocationPopup.bind(this)}>Map it</Button>			
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
       		   <Label bsStyle={status=='DELETED'? "danger" : status=='NEW'? "success" : "warning"}>{status}</Label>
       		
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
    }
	
	componentWillMount() {
	  this.loadProject(this.props.id);
	  this.store = ProjectStore;
	  let data = (this.store.get()) ? this.store.get() : {};
	  this.state = data;		
	}

    componentDidMount() {  
  	  this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
      this.unsuscribe()
    }
	
	loadProject(id) {
	  Actions.invoke(Constants.ACTION_LOAD_SINGLE_PROJECT, id);  
	}
	
	onStoreChange(project){
	  this.setState(project);
	}

    render() {
    return (
		<Draggable
			handle=".handle"
			start={{x: 20, y: 0}}
			grid={[1, 1]}
			zIndex={100}>
			<div id="project-info">
			  <div className="panel panel-success">
				 <div className="panel-heading  handle">
				 <h4>
				 	{this.state.project_id} - {this.state.title}
				 </h4>
				 </div>
				 <Tabs defaultActiveKey={1}>
				    <Tab eventKey={1} title="Project Info">
				    	<div className="panel-body list">
							  {this.state.long_description}

               <p><label>Country</label> {this.state.country?this.state.country.name:"N/A"}</p>
						</div>
					</Tab>
				    <Tab eventKey={2} title="Geocoding">
				    	<div className="panel-body list location-list">
							{
								this.state.locations?
									this.state.locations.map((item) => {
                    if(item.status != "LOCATION") 
	        						return <Item key={item.id} {...item}/>})
	        					: <h4> No Geocoding Data. </h4>
							}
						</div>
				    </Tab>
				    <Tab eventKey={3} title="Gazetteer Locations">
				    	<LocationsList/>
				    </Tab>
				  </Tabs>
				
			  </div>
			</div>
		  </Draggable>
    )
  }
}


export default ProjectInfo 