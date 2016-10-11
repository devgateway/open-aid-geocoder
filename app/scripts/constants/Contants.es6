
export default class Constants {

	static AUTO_ZOOM = 'AUTO_ZOOM';

	static AUTO_REMOVE_LOCATIONS: 'AUTO_REMOVE_LOCATIONS';

	static ACTION_SEARCH_LOCATIONS = 'ACTION_SEARCH_LOCATIONS';

	static ACTION_SEARCH_LOCATION_BY_GEONAMEID = 'ACTION_SEARCH_LOCATION_BY_GEONAMEID';

	static ACTION_UPDATE_ADM_FROM_GEONAMES = 'ACTION_UPDATE_ADM_FROM_GEONAMES';

	static ACTION_LOAD_SHAPE = 'ACTION_LOAD_SHAPE';

	static ACTION_UNLOAD_SHAPE= 'ACTION_UNLOAD_SHAPE';

	static ACTION_POPUP_INFO = 'ACTION_POPUP_INFO';

	static ACTION_CODE_LOCATION = 'ACTION_CODE_LOCATION';

	static ACTION_SAVE_CODED_LOCATION = 'ACTION_SAVE_CODED_LOCATION';

	static ACTION_DELETE_CODED_LOCATION = 'ACTION_DELETE_CODED_LOCATION';

	static ACTION_FIND_PROJECTS = 'ACTION_FIND_PROJECTS';

	static ACTION_LOAD_SINGLE_PROJECT = 'ACTION_LOAD_SINGLE_PROJECT';
	
	static ACTION_SET_ACTIVE_LOCATION = 'ACTION_SET_ACTIVE_LOCATION';

	static ACTION_LOAD_COUNTRY_LAYER_LIST = 'ACTION_LOAD_COUNTRY_LAYER_LIST';
	
	static ACTION_COUNTRY_LAYER_ADDED_TO_MAP ='ACTION_COUNTRY_LAYER_ADDED_TO_MAP';

	static ACTION_COUNTRY_LAYER_REMOVED_FROM_MAP ='ACTION_COUNTRY_LAYER_REMOVED_FROM_MAP';
	
	static ACTION_ADD_COUNTRY_LAYER = 'ACTION_ADD_COUNTRY_LAYER';

	static ACTION_REMOVE_COUNTRY_LAYER = 'ACTION_REMOVE_COUNTRY_LAYER';

	static ACTION_CHANGE_CODING_VALUE = 'ACTION_CHANGE_CODING_VALUE';

	static ACTION_DELETE_LOCATION = 'ACTION_DELETE_LOCATION';
	
	static ACTION_SAVE_LOCATION = 'ACTION_SAVE_LOCATION';

	static ACTION_PREPARE_SAVE_LOCATION = 'ACTION_PREPARE_SAVE_LOCATION';

	static ACTION_TOGGLE_LAYER_VISIBILITY = 'ACTION_TOGGLE_LAYER_VISIBILITY';

	static ACTION_OPEN_DATAENTRY_POPUP = 'ACTION_OPEN_DATAENTRY_POPUP';

	static ACTION_CLOSE_DATAENTRY_POPUP = 'ACTION_CLOSE_DATAENTRY_POPUP';

	static ACTION_SUBMIT_GEOCODING = 'ACTION_SUBMIT_GEOCODING';

	static ACTION_CANCEL_GEOCODING = 'ACTION_CANCEL_GEOCODING';

	static ACTION_SAVE_PROJECT = 'ACTION_SAVE_PROJECT';

	static ACTION_CHANGE_LANGUAGE='ACTION_CHANGE_LANGUAGE';

	static ACTION_FILTER_BY_TYPE='ACTION_FILTER_BY_TYPE';

	static ACTION_FIND_PROJECTS_UPDATE_PAGE = 'ACTION_FIND_PROJECTS_SET_PAGE';
	
	static ACTION_FIND_PROJECTS_SET_PARAM = 'ACTION_FIND_PROJECTS_SET_PARAM';
	
	static ACTION_CLEAN_MAP_STORE='ACTION_CLEAN_MAP_STORE';


	static ACTION_SET_FILE='ACTION_SET_FILE';

	static ACTION_UPLOAD_FILE='ACTION_UPLOAD_FILE';

	static ACTION_DISABLE_IMPORT='ACTION_DISABLE_IMPORT';

	static ACTION_ENABLE_IMPORT=' ACTION_ENABLE_IMPORT';

	static LOCATION_CLASS_LIST = [{
		'code': '1',
		'name': 'Administrative Region',
		'language': 'en',
		'description': 'The designated geographic location is an administrative region (state, county, province, district, municipality etc.)'
	}, {
		'code': '2',
		'name': 'Populated Place',
		'language': 'en',
		'description': 'The designated geographic location is a populated place (town, village, farm etc.)'
	}, {
		'code': '3',
		'name': 'Structure',
		'language': 'en',
		'description': 'The designated geopgraphic location is a structure (such as a school or a clinic)'
	}, {
		'code': '4',
		'name': 'Other Topographical Feature',
		'language': 'en',
		'description': 'The designated geographic location is a topographical feature, such as a mountain, a river, a forest'
	}];

	static EXACTNESS_LIST = [{
		'code': '1',
		'name': 'Exact',
		'language': 'en',
		'description': 'The designated geographic location is exact'
	}, {
		'code': '2',
		'name': 'Approximate',
		'language': 'en',
		'description': 'The designated geographic location is approximate'
	}];

}