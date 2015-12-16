 const Settings = class SettingsConstants {
 	static AUTO_ZOOM = "AUTO_ZOOM";
 	static AUTO_REMOVE_LOCATIONS: "AUTO_REMOVE_LOCATIONS";

 }

 const Search = class SearchConstants {
 	static ACTION_SEARCH_LOCATIONS = 'ACTION_SEARCH_LOCATIONS';
 	static ACTION_SEARCH_LOCATIONS_COMPLETED = 'ACTION_SEARCH_LOCATIONS_COMPLETED';
 }


const Shapes = class ShapesConstants {
 	static ACTION_LOAD_SHAPE = 'ACTION_LOAD_SHAPE';
	static ACTION_POPUP_INFO = 'ACTION_POPUP_INFO';
	static ACTION_CODE_LOCATION = 'ACTION_CODE_LOCATION';
	static ACTION_SAVE_CODED_LOCATION= 'ACTION_SAVE_CODED_LOCATION';
	static ACTION_DELETE_CODED_LOCATION = 'ACTION_DELETE_CODED_LOCATION'; 
}
 		
 
 const Project = class ProjectConstants {
 	static ACTION_LOAD_ALL_PROJECTS = 'ACTION_LOAD_ALL_PROJECTS';
	static ACTION_LOAD_SINGLE_PROJECT = 'ACTION_LOAD_SINGLE_PROJECT';
}

 export {Search, Settings, Shapes, Project}