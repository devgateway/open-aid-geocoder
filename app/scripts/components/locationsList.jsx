
import React from 'react';
import ReactDOM from 'react-dom';
import LocationsStore from '../stores/Locations.es6';

/*
  Renders a single Location 
*/
class Item extends React.Component{

  constructor() {
    super();
  }

  componentDidMount() { }

  componentWillUnmount() {}

  render() {
    return (
       <a href="#" className="list-group-item">
       <h4 className="list-group-item-heading">{this.props.name}</h4>
       <p className="list-group-item-text">
          {this.props.countryName}
          {this.props.fclName}
          {this.props.fcodeName}
        </p>
        </a>
    )
  }
}

  
/*
  Renders a  List of locations  
*/
class ListItems extends React.Component{
  constructor() {
    super();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
  <div className="list-group">

    {
      this.props.records.map((item) =>{

        return <Item   key={item.geonameId} {...item}/>}) //TODO: we should define another way to obtain the object key in order to support different sources maybe a hashcode 
    }
    </div>)
  }
}

/*
   This view renders  the Gazzetter Results 
*/
class LocationsList extends React.Component {

    constructor() {
      super();
      this.store=LocationsStore;
      let data=(this.store.get())?this.store.get().toJS():[]
      this.state=data
    }

    componentDidMount() {

     this.unsuscribe=this.store.listen(this.onStoreChange.bind(this));
  
    }

    componentWillUnmount() {
      this.unsuscribe()
    }

    onStoreChange(data){
      this.setState(data.toJS())
    }

    render() {
    return (
       <div id="locations">
        <div className="panel panel-info">
           <div className="panel-heading">List of Locations</div>
          <div className="panel-body list">
            <ListItems {...this.state}/>
          </div>
        </div>
      </div>

        )
  }
}


export default LocationsList  //TODO: rename maybe 