export default class Constants {

	static AUTO_ZOOM = "AUTO_ZOOM";

	static AUTO_REMOVE_LOCATIONS: "AUTO_REMOVE_LOCATIONS";

	static ACTION_SEARCH_LOCATIONS = 'ACTION_SEARCH_LOCATIONS';

	static ACTION_LOAD_SHAPE = 'ACTION_LOAD_SHAPE';

	static ACTION_POPUP_INFO = 'ACTION_POPUP_INFO';

	static ACTION_CODE_LOCATION = 'ACTION_CODE_LOCATION';

	static ACTION_SAVE_CODED_LOCATION = 'ACTION_SAVE_CODED_LOCATION';

	static ACTION_DELETE_CODED_LOCATION = 'ACTION_DELETE_CODED_LOCATION';

	static ACTION_LOAD_ALL_PROJECTS = 'ACTION_LOAD_ALL_PROJECTS';

	static ACTION_LOAD_SINGLE_PROJECT = 'ACTION_LOAD_SINGLE_PROJECT';
	
	static ACTION_SET_ACTIVE_LOCATION = 'ACTION_SET_ACTIVE_LOCATION';

	static ACTION_LOAD_COUNTRY_LAYER_LIST = 'ACTION_LOAD_COUNTRY_LAYER_LIST';

	static ACTION_ADD_COUNTRY_LAYER = 'ACTION_ADD_COUNTRY_LAYER';

	static ACTION_DELETE_LOCATION = 'ACTION_DELETE_LOCATION';
	
	static ACTION_SAVE_LOCATION = 'ACTION_SAVE_LOCATION';

	static ACTION_TOGGLE_LAYER_VISIBILITY = 'ACTION_TOGGLE_LAYER_VISIBILITY';

	static LOCATION_CLASS_LIST = [{
		"code": "1",
		"name": "Administrative Region",
		"language": "en",
		"description": "The designated geographic location is an administrative region (state, county, province, district, municipality etc.)"
	}, {
		"code": "2",
		"name": "Populated Place",
		"language": "en",
		"description": "The designated geographic location is a populated place (town, village, farm etc.)"
	}, {
		"code": "3",
		"name": "Structure",
		"language": "en",
		"description": "The designated geopgraphic location is a structure (such as a school or a clinic)"
	}, {
		"code": "4",
		"name": "Other Topographical Feature",
		"language": "en",
		"description": "The designated geographic location is a topographical feature, such as a mountain, a river, a forest"
	}];

	static EXACTNESS_LIST = [{
		"code": "1",
		"name": "Exact",
		"language": "en",
		"description": "The designated geographic location is exact"
	}, {
		"code": "2",
		"name": "Approximate",
		"language": "en",
		"description": "The designated geographic location is approximate"
	}];

}