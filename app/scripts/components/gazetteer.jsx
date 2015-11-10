import {Input,Button,Grid,Row,Col}  from 'react-bootstrap';
import React from 'react';


class Gazetteer extends React.Component {
  

  constructor() {
    super();
    this.state = {
      value: ""
    }
  }


 
  handleChange() {
    this.setState({
      value: this.refs.input.getValue()
    });
  }


  validationState() {
    let length = this.state.value.length;
    if (length > 3) return 'success';
    else if (length > 0) return 'error';
  }


  render() {
  
    return (
        <div style={{width: '400px'}} >
              <Input
               type="text"
              value={this.state.value}
              placeholder="Enter text"
              addonBefore="Search"
              bsStyle={this.validationState()}
              hasFeedback
              bsSize="small"
              ref="input"
              groupClassName="group-class"
              labelClassName="label-class"
              onChange={this.handleChange.bind(this)} >

              </Input> 
           </div>
    )
  }
}

export {Gazetteer}