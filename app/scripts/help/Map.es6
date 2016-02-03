import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Message from '../components/Message.jsx'

export default class MapHelp extends React.Component{
 
  
   help() {
    let node = ReactDOM.findDOMNode(this);
    
    let intro = Intro.introJs();
    intro.setOptions({
      steps: [{
        intro: Message.t('help.main.map')
      },

      {
        element: node.querySelector('.leaflet-control-layers '),
        intro: Message.t('help.main.layercontrol')
      },

      {
        element: node.querySelector('.leaflet-control-zoom'),
        intro: Message.t('help.main.zoomcontrol'),
        position:'left'
      },

      {
        element: node.querySelector('.btn-warning'),
        intro: Message.t('help.main.cancelbtn'),
         position:'left'
      },

      {
        element: node.querySelector('.btn-success'),
        intro: Message.t('help.main.submitbtn'),
        position:'left'
      }]
    });
    intro.start()
  }


}