import Constants from '../constants/Contants.es6'

let _instance;
export default class Settings {

	constructor() {
		

		this.env =(document.location.host.indexOf('localhost')>-1?'development':'production');


		/*Default settings, this json can be loaded from an external url*/
		this.settings = {
			MAP: {
				AUTO_ZOOM: true,
				AUTO_REMOVE_LOCATIONS: true,
			},

			SEARCH: {
				GEO_NAMES_SERVICE_USER_NAME: 'aiddata',
				FUZZY_LEVEL: 0
			},

			API: {
				API_BASE_URL: {
					'development': 'http://localhost:3001',
					'production': 'http://geocoding.dgstg.org',
				},

				PROJECT_LIST_END_POINT: 'projects',

				PROJECT_END_POINT: 'project'

			},

			I18N: {
				LOCALES_PATH: {
					development: '/locales/{{lng}}/{{ns}}.json',
					production: 'locales/{{lng}}/{{ns}}.json'
				},
				DEAULT_LNG: 'en',
				FALLBACK_LNG: 'en',
				DEAULT_NS: 'translations',
				FALLBACK_NS: 'common'
			}

		};
	}



	static getInstace() {
		if (!_instance) {
			_instance = new Settings()
		}
		return _instance;
	}

	get(module, name) {
		let mod = this.settings[module];
		let item = mod[name];

		if (item instanceof Object) {
			
			return item[this.env]; //return env based settin
		}else{
			return item;
		}
	}

	set(name, value) {
		this.settings[name] = value;
	}

	getEnv() {
		return this.env

	}

	setEnv(env) {
		this.env = env;
	}

}