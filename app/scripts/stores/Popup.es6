import {createStore} from 'reflux';

import * as Actions from '../actions/Actions.es6';
import *  as Constants from '../constants/Contants.es6';
import {List,Map,Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';


const initialData  = {};

/*This store should be renamed to geocoding and should actually manage the state of teh coding data 
whic*/
const PopUpStore = createStore({

	initialData:initialData,
	mixins: [StoreMixins],

	init() {
			this.listenTo(Actions.get(Constants.ACTION_POPUP_INFO), 'populateProperties');
	},

	getInitialState(){
		return this.get();
	},


	populateProperties(params){
		
		const {countryFeature,locationFeature,position}=params;
		if ( !countryFeature ){
			console.log("COUNTRY INFO IS EMPTY .....")
		}
		const  { CC_2, ENGTYPE_2, HASC_2, ID_0, ID_1, ID_2, ISO, NAME_0, NAME_1, NAME_2, NL_NAME_2 ,TYPE_2} = (countryFeature)?countryFeature.properties:{} ; //TODO: normalize field extraction
		const  { fclName, fcode, fcodeName, geonameId, lat, lng, name , toponymName , countryName , adminCode1 , adminName1} = locationFeature.properties;
		//position is  the screen map poistion of the click in lat and long while lat and lng is geonames point position  
		this.setData({NAME_0, NAME_1, NAME_2,fclName,fcode,fcodeName,geonameId, lat, lng, name , toponymName, position})
	},




});


export default PopUpStore;