require('leaflet/dist/leaflet.css')
import { PropTypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import * as Actions from '../../actions/Actions.es6';
import * as Constants from '../../constants/Contants.es6';


export default class LocationPopup extends React.Component {
 
   static propTypes = {}
 
   constructor(props) {
     super(props);
   }

 
  onPickLocationClick(){
    debugger;
    Actions.invoke(Constants.ACTION_CODE_LOCATION,this.props);
  }


   render() {
    const { NAME_0, NAME_1, NAME_2,fclName,fcode,fcodeName,geonameId, lat, lng, name , toponymName, position, mode} = this.props;
     return (
        <div className="popup">
              <h4> {name} </h4>
              <p className="text-muted"><strong>Admin 1</strong>: {(NAME_1)?NAME_1:'No Data'} </p>
              <p className="text-muted"><strong>Admin 2:</strong>  {(NAME_2)?NAME_2:'No Data'}</p>
              <p className="text-muted">{fcode} - {fcodeName}</p>
              <p className="text-muted">{toponymName}</p>
              <div className="row"> 
                 <Button className="pull-right"  bsSize="xsmall" bsStyle="warning" onClick={this.onPickLocationClick.bind(this)}>Pick Location</Button>
              </div>
        </div>
     );
   }
 }