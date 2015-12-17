require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import LocationsList from './LocationsList.jsx';
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
    debugger;
    return (
      <div className="fixed">
        <LocationsList/>
        <MapView/>
		    <ProjectInfo id={this.props.params.projectID}/>
      </div> )
  }
}
debugger;
export default FixedLayout 
