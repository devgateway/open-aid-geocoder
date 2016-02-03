import React from 'react';
import ReactDOM from 'react-dom';

import ShapesMapping from '../../../util/ShapesMapping.es6';
import CountryLayersStore from '../../../stores/CountryLayersStore.es6';
import  * as Actions from '../../../actions/Actions.es6'
import Constants from '../../../constants/Contants.es6';


class MapControl extends React.Component{

  componentDidMount(){
    let map = this.props.map;
    let pos = this.props.position;
    let corner = map._controlCorners[pos];
    
    let container=L.DomUtil.create('div','');
    
    if (pos.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }

    ReactDOM.render(this.props.children, container);
    
  }

  render(){
    return <div></div>
  }
} 



export default MapControl

