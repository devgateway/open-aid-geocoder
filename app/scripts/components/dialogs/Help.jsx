import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Message from '../components/Message.jsx'

export default class Help extends React.Component{
 
  help() {
     
      let node = ReactDOM.findDOMNode(this);
      let intro = Intro.introJs();
      let steps=[

      {
        element:node.querySelector('#name'),
        intro: Message.t("help.dataentry.locationname"),
        position: 'left'
      },
      {
        element:node.querySelector('#locationClass'),
        intro: Message.t("help.dataentry.locationclass"),
        position: 'left'
      },
      {
        element:node.querySelector('#exactness'),
        intro: Message.t("help.dataentry.exactness"),
        position: 'left'
      },
      {
        element:node.querySelector('.btn-success'),
        intro: Message.t("help.dataentry.savebtn"),
        position: 'left'
      }
      ,
      {
        element:node.querySelector('.btn-warning'),
        intro: Message.t("help.dataentry.cancelbtn"),
        position: 'left'
      }
      ];



      if (this.props.type!='location') {
       steps.push({
        element:node.querySelector('.btn-danger'),
        intro: Message.t("help.dataentry.deletebtn"),
        position: 'left'
      });


     }


     intro.setOptions({steps: steps});
     intro.start()
   }

   render(){
       <button className="btn btn-sm btn-info pull-right help" onClick={this.help.bind(this)}><i className="fa fa-question-circle"></i></button>
   }

}