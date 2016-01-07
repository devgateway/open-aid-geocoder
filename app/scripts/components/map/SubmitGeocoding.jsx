
import React from 'react';
import {ListGroup, ListGroupItem, Button, Input}  from 'react-bootstrap';
import { Link  } from 'react-router';
import  * as Actions from '../../actions/Actions.es6'
import * as Constants from '../../constants/Contants.es6';


class SubmitGeocoding extends React.Component{ 

  constructor() {
    super();
  }

  onSubmitCoding(){
  	Actions.invoke(Constants.ACTION_SUBMIT_GEOCODING);
  }

  render() {
    return (
      <div className='submit-container'>
        <Button bsStyle='success' onClick={this.onSubmitCoding.bind(this)}>Submit Geocoding</Button>
      </div>
    );
  }
}

export default SubmitGeocoding

