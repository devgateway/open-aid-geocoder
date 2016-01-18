
import React from 'react';
import {Button, Modal}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../../actions/Actions.es6'
import * as Constants from '../../constants/Contants.es6';


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
    window.location.replace("/");
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

  render() {
    //
    return (
      <div className='submit-container'>
        <Modal  {...this.props} show={this.state.showModal} onHide={this.cancel}>
          <Modal.Body>
            <h4 className="list-group-item-heading">
              This will overwrite the project geocoding with the current changes. 
              Are you sure?
            </h4>
            <hr/>
            <Button bsStyle='danger' onClick={this.cancel.bind(this)}>No</Button>
            <Button bsStyle='success' className="pull-right" onClick={this.onSubmitCoding.bind(this)}>Yes</Button>
          </Modal.Body>
        </Modal>        
        <Button bsStyle='warning' onClick={this.onCancelCoding.bind(this)}>Cancel</Button>
        <Button bsStyle='success' className="pull-right" onClick={this.openConfirm.bind(this)}>Submit</Button>
      </div>
    );
  }
}

export default SubmitGeocoding

