import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Help from './Help.jsx'
import Message from '../components/Message.jsx'

export default class DataEntryHelp extends Help{
 
  help() {
      
      let steps=[

      {
        element:this.node().querySelector('#noneditablefields'),
        intro: Message.t('help.dataentry.noneditablefields'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#adminOptionsContainer'),
        intro: Message.t('help.dataentry.adminoptions'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#locationClass'),
        intro: Message.t('help.dataentry.locationclass'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#exactness'),
        intro: Message.t('help.dataentry.exactness'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#activityDescription'),
        intro: Message.t('help.dataentry.activitydescription'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#savebutton'),
        intro: Message.t('help.dataentry.savebtn'),
        position: 'left'
      },
      {
        element:this.node().querySelector('#cancelbutton'),
        intro: Message.t('help.dataentry.cancelbtn'),
        position: 'left'
      }
      ];

      if (this.props.type!='location') {
       steps.push({
        element:this.node().querySelector('#deletebutton'),
        intro: Message.t('help.dataentry.deletebtn'),
        position: 'left'
      });
     }

      this.options={steps}
      this.show();
   }


}