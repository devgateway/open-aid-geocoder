require('../../../stylesheets/layerControl.scss');

import React from 'react';
import {ListGroup, ListGroupItem, Button, Input}  from 'react-bootstrap';
import { Link  } from 'react-router';
import ShapesMapping from '../../util/ShapesMapping.es6';
import CountryLayersStore from '../../stores/CountryLayersStore.es6';
import  * as Actions from '../../actions/Actions.es6'
import * as Constants from '../../constants/Contants.es6';


/*
  Renders a single Item 
*/
class Item extends React.Component{

  constructor() {
    super();
  }

  componentDidMount() { }

  componentWillUnmount() {}

  _toggleLayerVisibility(e){
    Actions.invoke(Constants.ACTION_TOGGLE_LAYER_VISIBILITY, {'iso': e.target.value, 'visible': e.target.checked});
  }

  render() {
    return (
      <ListGroupItem>         
        <Input type="checkbox" label={this.props.name} checked={this.props.visible} value={this.props.iso} onChange={this._toggleLayerVisibility.bind(this)} />
      </ListGroupItem>
    )
  }
}

/*
  Renders a  List of Country Layers  
*/
class LayerList extends React.Component{
  constructor() {
    super();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="list-group">
        <ListGroup>
        {
          this.props.shapeList.map((item) =>{
            return <Item key={item.iso} {...item}/>}
          )           
        }
        </ListGroup>
      </div>
    )
  }
}

class CountryLayerControl extends React.Component{ 

  constructor() {
    super();
    this.state = {'visible': false};
    this.store=CountryLayersStore;   
  }

  componentDidMount() {
    this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  onStoreChange(storeData){
    let newState=Object.assign(this.state, storeData);
    this.setState(newState);
  }

  _toggleVisibility(){
  	this.setState({
      'visible': !this.state.visible
    });
  }

  render() {
    var buttonLabel = this.state.visible? "Hide layers" : "Show layers";
    return (
      <div className='layer-control-container'>
        <button className='show-layers-button' onClick={this._toggleVisibility.bind(this)}>{this.state.visible? "Hide layers" : "Show layers"}</button>
        { 
        	this.state.visible?
	          	<div className='layers-content'>
	          		<LayerList {...this.state}/>
          		</div>
          	: ""
        }
      </div>
    );
  }
}

export default CountryLayerControl

