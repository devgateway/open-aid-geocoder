
import { PropTypes } from 'react';
import { geoJson } from 'leaflet';
import { Path } from 'react-leaflet';
import React from 'react';

export default  class DynamicGeoJson extends Path {
  constructor(){
    super();
  }

  static propTypes = {
    autoZoom: React.PropTypes.bool,
  };

  componentWillMount() {
    super.componentWillMount();
    const {data, map, ...props} = this.props;
    this.leafletElement = geoJson(data, props);

  }

  _parent() {
    return (this.props.layerGroup || this.props.map);
  }

  _remove() {
    this._parent().removeLayer(this.leafletElement);
  }

  _create() {
    const {data, ...props} = this.props;
    /*if pointToLayer or onEachFeature are not set in props call to  the internal function w*/   
    Object.assign( props,{'pointToLayer':this.props.pointToLayer || this.pointToLayer.bind(this),'onEachFeature': this.props.onEachFeature|| this.onEachFeature.bind(this)}); 

    this.leafletElement = geoJson(data, props);
    this._parent().addLayer(this.leafletElement);
  }

  _update() {
    this._remove();
    this._create();
  }



  /*
  Every time the component gets updated it checks if the geojson data has changed, if changed the layer should be re-created
   */
  componentDidUpdate(prevProps) {
    const {data, map, ...props} = this.props;
    if (this.props.data != prevProps.data) { //we should do a better work to detect data changes 
        this._update(); //update layer 
      if (props.autoZoom) {
        map.fitBounds(this.leafletElement)
      }
    }
    this.setStyleIfChanged(prevProps, this.props);
  }

  /*Layer interaction*/

   pointToLayer(feature, latlng){
      console.log('not implemented');
  }

   onEachFeature(feature, layer) {
     console.log('not implemented');  
  }


}
