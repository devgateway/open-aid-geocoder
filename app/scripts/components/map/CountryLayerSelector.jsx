import React from 'react';
import {ListGroup, ListGroupItem, Button, Modal, Grid, Col, Table, Row, Pagination}  from 'react-bootstrap';
import { Link  } from 'react-router';
import ShapesMapping from '../../util/ShapesMapping.es6';
import CountryLayersStore from '../../stores/CountryLayersStore.es6';
import  * as Actions from '../../actions/Actions.es6'
import * as Constants from '../../constants/Contants.es6';

/*
  Renders a single Item 
*/
class LayerItem extends React.Component{

  constructor() {
    super();
  }

  componentDidMount() { 
  }

  componentWillUnmount() {}

  _addLayer(e){
    Actions.invoke(Constants.ACTION_ADD_COUNTRY_LAYER, e.target.value);
  }

  render() {
    return (
      <ListGroupItem>
                {this.props.name} 
                {this.props.loading?<span>(Loading)</span>:null}
                {this.props.added? <span className='pull-right'>Added</span> : <Button  bsStyle='primary' bsSize='small' className='pull-right' onClick={this._addLayer.bind(this)} value={this.props.iso}>Add</Button>}
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
            return <LayerItem key={item.iso} {...item}/>}
          )           
        }
        </ListGroup>
      </div>
    )
  }
}



class CountryLayerSelector extends React.Component{ 

  constructor() {
    super();
    this.store=CountryLayersStore;
    this.state = {'showModal': false};
  }

  componentDidMount() {
    Actions.invoke(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST);//loads country layer list
    this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.unsuscribe();
  }

  onStoreChange(storeData){
    let newState=Object.assign(this.state, storeData);
    this.setState(newState);
  }

  close(e){
    let newState=Object.assign(this.state, {'showModal': false});
    this.setState(newState);
    if (this.props.onClose){
      this.props.onClose();
    }
  }

  open(e){
    //Actions.invoke(Constants.ACTION_LOAD_COUNTRY_LAYER_LIST);
    let newState=Object.assign(this.state, {'showModal': true});
    this.setState(newState);
  }

  render() {
    return (
        <div className="navbar-form navbar-left">
          <Button bsStyle='primary' bsSize="xsmall" onClick={this.open.bind(this)}>Add Country Layer</Button>
          <Modal  {...this.props} bsSize='large' show={this.state.showModal} onHide={this.close}>
            <Modal.Header>
              <a className='close-dialog' href='#' onClick={this.close.bind(this)}><i className='fa fa-times-circle-o'></i></a>
              <Modal.Title><i className='fa fa-arrows-h'></i>Select Country Layer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LayerList {...this.state}/>
            </Modal.Body>
            <Modal.Footer>
              <Button className='pull-right' onClick={this.close.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default CountryLayerSelector

