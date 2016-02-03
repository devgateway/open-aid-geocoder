import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'
import Message from '../components/Message.jsx'

export default class Help extends React.Component{
 
    getDomObject(){
      debugger;
      return this.checkParentById(ReactDOM.findDOMNode(this), this.props.parentId);
    }

    checkParentById(obj, id){
      if (obj.parentElement.id == id){
        return obj.parentElement;
      } else {
        return this.checkParentById(obj.parentElement, id);
      }
    } 

    render(){
      return (
        <button className="btn btn-sm btn-info pull-right help" onClick={this.help.bind(this)}><i className="fa fa-question-circle"></i></button>
      );
    }
}