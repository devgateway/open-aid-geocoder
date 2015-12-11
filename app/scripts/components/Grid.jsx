
require('../../stylesheets/gridisgood.css')
import React from 'react';
import  Grid from '../util/lib/Grid.jsx';
import {LocationsList} from './LocationsList.jsx';
import MapView from './map/Map.jsx';
/**
 * [render description]
 * @param  {String} ) {                   return (            <div className [description]
 * @return {[type]}   [description]
 */
let  GridLayout = React.createClass({
    render: function() {
        return (
            <div className="grid">
                <Grid
                    baseWidth={100}
                    baseHeight={100}
                    margins={[1, 1]}
                    handle={true}
                    addable={false}
                    removable={false}
                    resizable={true}
                    rowsExpandable={true}
                    colsExpandable={true}
                    // buildFromArray is an optional prop
                    // Use either it or nested divs i.e. this.props.children
                    // buildFromArray={[{'row':0,'col':0,'rowspan':1,'colspan':3,'children':"1"}]}
                >
                    <div colspan={3} rowspan={5} row={0} col={0}>     <LocationsList/></div>
                    <div colspan={12} rowspan={8} row={0} col={3}><MapView/></div>
                    
                </Grid>
            </div>
        );
    }
});


export default GridLayout