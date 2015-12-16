
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import SingleProjectStore from '../stores/SingleProjectStore.es6';

/*
   This view renders the Project Information UI component
*/
class ProjectInfo extends React.Component {

    constructor() {
      super();
    }
	
	componentWillMount() {
	  this.loadProject(this.props.id);
	  this.store = SingleProjectStore;
	  let data = (this.store.get()) ? this.store.get() : [];
	  this.state = data;		
	}

    componentDidMount() {  
  	  this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
      this.unsuscribe()
    }
	
	loadProject(id) {
	  Actions.invoke(Constants.Project.ACTION_LOAD_SINGLE_PROJECT, id);  
	}
	
	onStoreChange(data){
	  this.setState(data.project.data);
	}

    render() {
    return (
		<Draggable
			handle=".handle"
			start={{x: 0, y: 0}}
			grid={[25, 25]}
			zIndex={100}>
			<div id="project-info">
			  <div className="panel panel-info">
				 <div className="panel-heading handle">{this.state.title}</div>
				<div className="panel-body list">
					  {this.state.long_description}
				</div>
			  </div>
			</div>
		  </Draggable>
    )
  }
}


export default ProjectInfo 