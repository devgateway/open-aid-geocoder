require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import MapView from './map/Map.jsx'
import ProjectInfo from './ProjectInfo.jsx';


/**
 * 
 */
class FixedLayout extends React.Component {

    constructor() {
      super();
    }
	
	componentDidMount() {
	}

  render() {
   
    return (
      <div className="fixed">
        <MapView/>
		    <ProjectInfo id={this.props.params.projectID}/>
      </div> )
  }
}

export default FixedLayout 
