import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {List, Map, Record} from 'immutable';
import {StoreMixins} from '../mixins/StoreMixins.es6';

const initialData = {};
const DataEntryStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_OPEN_DATAENTRY_POPUP), 'openPopup');
	},

	openPopup(location){
		console.log(location);
		var newState = Object.assign({}, this.get());
		Object.assign(newState, {'location': location});//set the location to be used
		Object.assign(newState, {'showPopup': true});//open the popup
		this.setData(newState);
	}
});



export default DataEntryStore;