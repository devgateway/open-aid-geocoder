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

      this.container=L.DomUtil.create('div','leaflet-control '+this.props.className);

      if (pos.indexOf('bottom') !== -1) {
        corner.insertBefore(this.container, corner.firstChild);
      } else {
        corner.appendChild(this.container);
      }

      this.props.map.on('resize', this.onResize.bind(this), this);
   
      ReactDOM.render(this.props.children, this.container);

      this.props.map.on('zoomend',(a)=>{
        console.log(this.props.map.getZoom());
      },this);
    }


    onResize() {
     var mapHeight = this.props.map.getContainer().clientHeight;
     var controlHeight = this.container.clientHeight;
     this.container.style.maxHeight = (mapHeight - (this.props.bottomPadding || 0) - (this.props.topPadding || 0)) + 'px';
   }

   render(){
    return null;
  }
} 

export default MapControl;

