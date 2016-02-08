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
        <div className={"help"+(this.props.className?this.props.className:"")} onClick={this.help.bind(this)}>{""}</div>
      );
    }
}