
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

/*
   This view renders the Project information  
*/
class ProjectInfo extends React.Component {

    constructor() {
      super();
    }

    componentDidMount() {
  
    }

    componentWillUnmount() {
      this.unsuscribe()
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
				 <div className="panel-heading handle">Project Information</div>
				<div className="panel-body list">
					  Some project information
				</div>
			  </div>
			</div>
		  </Draggable>
    )
  }
}


export default ProjectInfo 