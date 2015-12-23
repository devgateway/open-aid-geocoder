
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
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
       <h4 className="list-group-item-heading"><strong>{this.props.name}</strong>, {this.props.countryName}</h4>
       <p className="list-group-item-text location-item">          
          {this.props.fclName}
        </p>
		<p className="list-group-item-text location-item">          
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
		<Draggable
			handle=".handle"
			start={{x: 0, y: 0}}
			grid={[25, 25]}
			zIndex={100}>
		    <div id="locations">
			<div className="panel panel-info">
			  <div className="panel-heading handle">List of Locations</div>
			    <div className="panel-body list">
			 	  <ListItems {...this.state}/>
			    </div>
			  </div>
		    </div>
		</Draggable>
      )
  }
}


export default LocationsList  //TODO: rename maybe 