import * as Constants from '../constants/Contants.es6' 

export default class Settings {

	constructor(options) {
		this.settings=new Object();
		this.settings[Constants.AUTO_ZOOM]=true;
		this.settings[Constants.AUTO_REMOVE_LOCATIONS]=true;
	}

}



