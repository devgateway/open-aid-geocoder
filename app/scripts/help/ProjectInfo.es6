import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Message from '../components/Message.jsx'

export default class ProjectInfoHelp extends React.Component{
 
  
  help() {
    let node=ReactDOM.findDOMNode(this);
    
    let intro=Intro.introJs();
    intro.setOptions({steps:[
      {
        element: node.querySelector('h4'),
        intro: Message.t("help.main.panel_title"),
        position:'bottom'
      },
        {
        element: node.querySelectorAll('.nav-tabs li')[0],
        intro: Message.t("help.main.panel_project"),
        position:'bottom'
      },
      {
        element: node.querySelectorAll('.nav-tabs li')[1],
        intro: Message.t("help.main.panel_geocoding"),
        position:'bottom'
      },
      {
        element: node.querySelectorAll('.nav-tabs li')[2],
        intro: Message.t("help.main.panel_locations"),
        position:'bottom'
      }
    ]});
    intro.start() 
  }


}