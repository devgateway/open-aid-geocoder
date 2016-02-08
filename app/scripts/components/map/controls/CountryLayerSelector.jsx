import React from 'react';
import {ListGroup, ListGroupItem, Button, Modal, Grid, Col, Table, Row, Pagination}  from 'react-bootstrap';
import Message from '../../Message.jsx'
import CountryLayersStore from '../../../stores/CountryLayersStore.es6';
import  * as Actions from '../../../actions/Actions.es6'
import Constants from '../../../constants/Contants.es6';

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

  _removeLayer(e){
    Actions.invoke(Constants.ACTION_REMOVE_COUNTRY_LAYER, e.target.value);
  }

  render() {
    return (
      <ListGroupItem>
        {this.props.name} 
        {this.props.loading?
          <kbd className="pull-right"><Message k="layerselector.loading"/></kbd>:  (this.props.added)? 
          <Button  bsStyle='warning' bsSize='xsmall' className='pull-right' onClick={this._removeLayer.bind(this)} value={this.props.iso}><Message k="layerselector.remove"/></Button>
        : <Button  bsStyle='info' bsSize='xsmall' className='pull-right' onClick={this._addLayer.bind(this)} value={this.props.iso}><Message k="layerselector.add"/></Button>
        }
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
        <div className="leaflet-control leaflet-control-layers leaflet-control-layers-countries leaflet-control">

        <div className="leaflet-control-layers-toggle" title="Manage Country Layers" onClick={this.open.bind(this)}></div>
          <Modal  {...this.props} bsSize='large' show={this.state.showModal} onHide={this.close}>
            <Modal.Header>
              <a className='close-dialog pull-right' onClick={this.close.bind(this)}><i className='fa fa-times-circle-o'></i></a>
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

