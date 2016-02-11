import React from 'react';
import ReactDOM from 'react-dom';

import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class LocationsSearchHelp extends Help {

  constructor() {
    super();
  }
  help() {
    
    this.options={
      steps:[
      {
        element: this.node().querySelector('input[type=text]'),
        intro: Message.t('help.header.textinput'),
        position:'bottom'
      },

      {
        element: this.node().querySelector('#fuzzydiv'),
        intro: Message.t('help.header.fuzzycheck'),
        position:'bottom'
      },
      {
        element: this.node().querySelector('#countrydiv'),
        intro: Message.t('help.header.countrycheck'),
        position:'bottom'
      },
      {
        element: this.node().querySelector('#searchdiv'),
        intro: Message.t('help.header.searchbtn'),
        position:'bottom'
      }      
    ]}
     this.show();
  }

}