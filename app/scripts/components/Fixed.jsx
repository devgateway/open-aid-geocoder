require('leaflet/dist/leaflet.css')

import React from 'react';
import { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {LocationsList} from './LocationsList.jsx';
import MapView from './map/Map.jsx'

/**
 * 
 */
class FixedLayout extends React.Component {

    constructor() {
      super();
    }

    componentDidMount() {
      debugger
  
    }

    componentWillUnmount() {
    }

  
  render() {
    return (
      <div className="fixed">
        <LocationsList/>
        <MapView/>
      </div> )
  }
}

export default FixedLayout 
