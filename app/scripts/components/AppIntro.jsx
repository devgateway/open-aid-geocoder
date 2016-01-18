
import React from 'react';

import ReactDOM from 'react-dom';

import {Button}  from 'react-bootstrap';

import { Link  } from 'react-router';

import  * as Actions from '../actions/Actions.es6';
import * as Constants from '../constants/Contants.es6';
import * as Intro from 'intro.js'

import ProjectListStore from '../stores/ProjectListStore.es6';


/* Renders a link to a specific project */
export default class AppIntro extends React.Component {

	start() {
		let intro = Intro.introJs();
		intro.setOptions({steps:this.steps});
		intro.start()
		
	}

	constructor() {
		super();
	}


	render(){
		return  <div bsStyle="primary" bsSize="xsmall" onClick={this.start.bind({steps:this.props.steps})}>{this.props.label}</div>
	}

}
