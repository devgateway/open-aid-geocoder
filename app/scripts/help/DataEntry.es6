import React from 'react';
import ReactDOM from 'react-dom';
import * as Intro from 'intro.js'

export default class DataEntryHelp  extends  React.Component{
 
  help() {
     
      let node = ReactDOM.findDOMNode(this);
      let intro = Intro.introJs();
      let steps=[

      {
        element:node.querySelector('#name'),
        intro: "The location name is gathered from the gazetteer location and is not editable",
        position: 'left'
      },
      {
        element:node.querySelector('#country'),
        intro: "Country info is gathered from the gazetteer location and  is not editable",
        position: 'left'
      },
      {
        element:node.querySelector('#admin1'),
        intro: "Admininistrative division level one is gathered from country shape layer,and is not editable ",
        position: 'left'
      },
      {
        element:node.querySelector('#admin2'),
        intro: "Admininistrative division level two is gathered  from the country shape layer and is not editable ",
        position: 'left'
      },
      
      {
        element:node.querySelector('.toggler'),
        intro: "Use this button to toggle between shape or gazetteer values ",
        position: 'left'
      },

      {
        element:node.querySelector('#id'),
        intro: "The location id  is gathered from the gazetteer location and is not editable",
        position: 'left'
      },
      
      {
        element:node.querySelector('#geometryType'),
        intro: "The geometry type is point by default whe coding locations returned by the gazetteer",
        position: 'left'
      },

      {
        element:node.querySelector('#coordinates'),
        intro: "The geogprahicaly corddinates are expressed as latitude,longitude and gathered form the gazetteer location ",
        position: 'left'
      },
      {
        element:node.querySelector('#featureDesignationContainer'),
        intro: 'Feature designation is gathered from the gazetteer location and is not editable,  more information about this field can be found here <br><a class="small" href="http://www.geonames.org/export/codes.html">http://www.geonames.org/export/codes.html</a> ',
        position: 'left'
      },
      {
        element:node.querySelector('#locationClass'),
        intro: 'Location classs should be manually enterd and it defines whether the location  refers to  a structure, a populated place (e.g. city or village), an administrative division, or another topological feature (e.g. river, nature reserve),  pleae visit  <br><a class="small" href="http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/location-class/">http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/location-class/</a> ',
        position: 'left'
      },

      {
        element:node.querySelector('#exactness'),
        intro: 'Exactness should be entered manually and it defines whether the location represents the most distinct point reasonably possible for this type of activity or is an approximation due to lack of more detailed information. <br><a class="small" href="http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/exactness/">http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/exactness/</a> ',
        position: 'left'
      },

      {
        element:node.querySelector('#activityDescription'),
        intro: 'A free input text  <br><a class="small" href="http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/exactness/">http://iatistandard.org/201/activity-standard/iati-activities/iati-activity/location/exactness/</a> ',
        position: 'left'
      },

      {
        element:node.querySelector('.btn-success'),
        intro: 'Click here to save or update the location',
        position: 'left'
      }
      ,
      {
        element:node.querySelector('.btn-warning'),
        intro: 'Click here to candel the edition',
        position: 'left'
      },
      {
        element:node.querySelector('.btn-primary'),
        intro: 'Click here to update the info from Geonames service',
        position: 'rigth' 
      }


      ];



      if (this.props.type!='location'){

       steps.push({
        element:node.querySelector('.btn-danger'),
        intro: 'Click here to delete de location',
        position: 'left'
      });


     }

     steps.push(      {
        element:node.querySelector('.btn-info'),
        intro: 'Click here to show this help',
        position: 'left'
      })



     intro.setOptions({steps: steps});
     intro.start()
   }


}