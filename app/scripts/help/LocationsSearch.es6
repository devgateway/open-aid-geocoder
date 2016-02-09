import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class LocationsSearchHelp extends Help {

  help() {
    let node = this.getDomObject();
    let intro=Intro.introJs();
    intro.setOptions({steps:[
      {
        element: node.querySelector('input[type=text]'),
        intro: Message.t('help.header.textinput'),
        position:'bottom'
      },

      {
        element: node.querySelector('#fuzzydiv'),
        intro: Message.t('help.header.fuzzycheck'),
        position:'bottom'
      },
      {
        element: node.querySelector('#countrydiv'),
        intro: Message.t('help.header.countrycheck'),
        position:'bottom'
      },
      {
        element: node.querySelector('#searchdiv'),
        intro: Message.t('help.header.searchbtn'),
        position:'bottom'
      }      
    ]});
    intro.start()
  }

}