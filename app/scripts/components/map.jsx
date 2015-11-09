
require('leaflet/dist/leaflet.css')



import React from 'react';

import ReactDOM from 'react-dom';

import Button from 'react-bootstrap';
import L  from 'leaflet'


class Map extends React.Component {

  constructor() {
    super();
    this.state = {
      data: "Test"
    }
  }


  componentDidMount() {
    const map = L.map(ReactDOM.findDOMNode(this), {center: [51.505, -0.09],zoom: 13});
    console.log('Map did mount');

    var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    OpenStreetMap_Mapnik.addTo(map)
  }


  _handleClick() {
    alert('test4');
  }

  render() {
    return (
      <div className="map-container"> 


      </div>
    )
  }
}

export {
  Map
}