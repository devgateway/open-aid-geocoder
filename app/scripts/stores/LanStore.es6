import {createStore} from 'reflux';
import * as Actions from '../actions/Actions.es6';
import  Constants from '../constants/Contants.es6';
import {StoreMixins} from '../mixins/StoreMixins.es6';
import i18next from 'i18next';

const initialData = {lan:'en'}; //
const LanStore = createStore({

	initialData: initialData,
	mixins: [StoreMixins],

	init() {
		this.data=initialData;
		this.listenTo(Actions.get(Constants.ACTION_CHANGE_LANGUAGE), 'setLan');
	},

	setLan(lan){
		i18next.changeLanguage(lan, (err, t) => {
			if (err) {
				console.log(err);
			}else{
				this.setData({'lan':lan})
			}
		});
		;
	}
});



export default LanStore;