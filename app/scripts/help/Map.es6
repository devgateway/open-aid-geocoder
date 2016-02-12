import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class MapHelp extends Help{


 help() {
   this.options={
    tooltipPosition : 'top',
    steps: [{
      intro: Message.t('help.main.map')
    },

    {
      element: this.node().querySelector('#countryLayerSelector'),
      intro: Message.t('help.main.countrylayercontrol'),
      position: 'right'
    },

    {
      element: this.node().querySelector('.leaflet-control-layers-minimap'),
      intro: Message.t('help.main.layercontrol'),
      position: 'left'
    },

    {
      element: this.node().querySelector('#infoControl'),
      intro: Message.t('help.main.infocontrol'),
      position: 'right'
    },

    {
      element: this.node().querySelector('.leaflet-control-zoom'),
      intro: Message.t('help.main.zoomcontrol'),
      position: 'left'
    },

    {
      element: this.node().querySelector('#cancelCoding'),
      intro: Message.t('help.main.cancelbtn'),
      position: 'left'
    },

    {
      element: this.node().querySelector('#submitCoding'),
      intro: Message.t('help.main.submitbtn'),
      position: 'left'
    }]
  }
  this.show()
}


}