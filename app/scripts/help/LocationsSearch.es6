import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'

export default class LocationsSearchHelp extends React.Component {

  help() {
    let node=ReactDOM.findDOMNode(this);
    
    let intro=Intro.introJs();
    intro.setOptions({steps:[
      {
        element: node,
        intro: Message.t('help.header.textinput')
      },

      {
        element: node.querySelector('input[name=fuzzy]'),
        intro: Message.t('help.header.fuzzycheck'),
        position: 'left'
      },
      {
        element: node.querySelector('input[name=country]'),
        intro: Message.t('help.header.countrycheck'),
      },
      {
        element: node.querySelector('.btn-search'),
        intro: Message.t('help.header.searchbtn'),
      }      
    ]});
    intro.start()
  }

}