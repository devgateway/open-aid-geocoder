import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Message from '../components/Message.jsx'

export default class Help extends React.Component{
 
    getDomObject(){
      return ReactDOM.findDOMNode(this).closest('#'+ this.props.parentId);
    }

    render(){
      return (
        <button className="btn btn-sm btn-info pull-right help" onClick={this.help.bind(this)}><i className="fa fa-question-circle"></i></button>
      );
    }
}