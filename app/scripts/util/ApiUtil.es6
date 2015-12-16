import AjaxUtil from './AjaxUtil.es6';

let _dataSources = {
	'projects': window.API_URL + 'projects',
	'project': window.API_URL + 'project/',
}

let util=AjaxUtil;

/**
 * Get all projects fron mock data
  * @return {[array]}     an array with all projects
 */
let getProjectList = () => {
	let url = _dataSources.projects;
	return new Promise((resolve, reject) => {
		AjaxUtil.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((response) => {
				reject( `got ${response.status}  ${response.statusText}`)
			})
	})
}

/**
 * Get a project by project_id
  * @return {} project
 */
let getProject = (project_id) => {
	let url = _dataSources.project + project_id;
	return new Promise((resolve, reject) => {
		AjaxUtil.get(url)
			.then((response) => {
				resolve(response);
			})
			.catch((response) => {
				reject( `got ${response.status}  ${response.statusText}`)
			})
	})
}

/**
 * Save a project by project_id
  * @return {} project
 */
let saveProject = (project) => {
	let url = _dataSources.project + project.project_id;
	return new Promise((resolve, reject) => {
		AjaxUtil.put(url, project)
			.then((response) => {
				resolve(response);
			})
			.catch((response) => {
				reject( `got ${response.status}  ${response.statusText}`)
			})
	})
}

export default getProjectList