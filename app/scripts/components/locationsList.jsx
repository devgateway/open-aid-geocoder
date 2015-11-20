
import React from 'react';
import ReactDOM from 'react-dom';
import {LocationsStore} from '../stores/locations.es6';

class Item extends React.Component{

  constructor() {
    super();
  }

  componentDidMount() {
   debugger;
   }

  componentWillUnmount() {
  debugger;
  }

  render() {
    debugger;
    return (

       <a href="#" class="list-group-item active">
       <h4 class="list-group-item-heading">{this.props.name}</h4>
       <p class="list-group-item-text">
          {this.props.countryName}
          {this.props.fclName}
          {this.props.fcodeName}
        </p>
        </a>
    )
  }
}

  



class ListItems extends React.Component{
  constructor() {
    super();
  }

  componentDidMount() {
   debugger;
   }

  componentWillUnmount() {
  debugger;
  }

  render() {
    return (
  <div class="list-group">

    {
      this.props.records.map((item) =>{

        return <Item {...item}/>}) 
    }
    </div>)
  }
}


class LocationsList extends React.Component {

    constructor() {
      super();
      this.state={records:[]}
    }

    componentDidMount() {
      LocationsStore.listen(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
      LocationsStore.unlisten(this.onStoreChange);
    }

    onStoreChange(data){
      this.setState(data.toJS())
    }



    render() {
    return (
       <div id="locations">
        <div className="panel panel-info">
           <div className="panel-heading">List of Locations</div>
          <div className="panel-body">
            <ListItems {...this.state}/>
          </div>
        </div>
      </div>

        )
  }
}


export { LocationsList }