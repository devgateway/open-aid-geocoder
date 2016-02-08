
import React from 'react';
import {Button, Modal}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../../../actions/Actions.es6'
import Constants from '../../../constants/Contants.es6';
import MapHelp from '../../../help/Map.es6';
import Message from '../../Message.jsx'

class SubmitGeocoding extends React.Component{ 

  constructor() {
    super();
    
    this.state = {'showModal': false};
  }

  onSubmitCoding(){
    Actions.invoke(Constants.ACTION_SUBMIT_GEOCODING);
    this.cancel();
  }

  onCancelCoding(){
    window.history.back();
    window.location.reload();
    this.cancel();
  }

  cancel(){
    let newState = Object.assign({}, this.state);
    Object.assign(newState, {'showModal': false});
    this.setState(newState);
  }

  openConfirm(){
    let newState = Object.assign({}, this.state);
    Object.assign(newState, {'showModal': true});
    this.setState(newState);
  }


  componentDidMount(){
    let container=ReactDOM.findDOMNode(this);
    L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
    L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
  }

  render() {
    return (
   <div id="action-buttons">       
        <Modal  {...this.props} show={this.state.showModal} onHide={this.cancel}>
          <Modal.Body>
            <h4 className="list-group-item-heading">
              <Message k="submitgeocoding.submitmessage"/>
            </h4>
            <hr/>
            <Button bsStyle='danger' onClick={this.cancel.bind(this)}><Message k="general.no"/></Button>
            <Button bsStyle='success' className="pull-right" onClick={this.onSubmitCoding.bind(this)}><Message k="general.yes"/></Button>
          </Modal.Body>
        </Modal>        
        

        <MapHelp parentId="mapContainer"/>
        <Button bsStyle='warning'  onClick={this.onCancelCoding.bind(this)}><Message k="submitgeocoding.cancel"/></Button>
        <Button bsStyle='success'  onClick={this.openConfirm.bind(this)}><Message k="submitgeocoding.submit"/></Button>
    </div>
    );
  }
}

export default SubmitGeocoding


