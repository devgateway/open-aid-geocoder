import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class DataEntryHelp extends Help{
 
  help() {
     
      let node = this.getDomObject();
      let intro = Intro.introJs();
      let steps=[

      {
        element:node.querySelector('#noneditablefields'),
        intro: Message.t('help.dataentry.locationname'),
        position: 'left'
      },
      {
        element:node.querySelector('#adminOptionsContainer'),
        intro: Message.t('help.dataentry.adminoptions'),
        position: 'left'
      },
      {
        element:node.querySelector('#locationClass'),
        intro: Message.t('help.dataentry.locationclass'),
        position: 'left'
      },
      {
        element:node.querySelector('#exactness'),
        intro: Message.t('help.dataentry.exactness'),
        position: 'left'
      },
      {
        element:node.querySelector('#activityDescription'),
        intro: Message.t('help.dataentry.activitydescription'),
        position: 'left'
      },
      {
        element:node.querySelector('#savebutton'),
        intro: Message.t('help.dataentry.savebtn'),
        position: 'left'
      },
      {
        element:node.querySelector('#cancelbutton'),
        intro: Message.t('help.dataentry.cancelbtn'),
        position: 'left'
      }
      ];

      if (this.props.type!='location') {
       steps.push({
        element:node.querySelector('#deletebutton'),
        intro: Message.t('help.dataentry.deletebtn'),
        position: 'left'
      });
     }

     intro.setOptions({steps: steps});
     intro.start()
   }


}