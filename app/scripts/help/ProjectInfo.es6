import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class ProjectInfoHelp extends Help{
 
  
  help() {
  this.options={steps:[
      {
        element: this.node().querySelector('.panel-heading'),
        intro: Message.t('help.main.panel_title'),
        position:'bottom'
      },
        {
        element: this.node().querySelectorAll('.nav-tabs li')[0],
        intro: Message.t('help.main.panel_project'),
        position:'bottom'
      },
      {
        element: this.node().querySelectorAll('.nav-tabs li')[1],
        intro: Message.t('help.main.panel_geocoding'),
        position:'bottom'
      },
      {
        element: this.node().querySelectorAll('.nav-tabs li')[2],
        intro: Message.t('help.main.panel_locations'),
        position:'bottom'
      }
    ]};
    this.show(); 
  }


}