import AjaxUtil from './AjaxUtil.es6';

export default class ApiClient {
	/**
	 * Get all projects fron mock data
	 * @return {[array]}     an array with all projects
	 */
	static getProjectList() {
		return new Promise((resolve, reject) => {
			AjaxUtil.get(window.PROJECT_LIST_URL)
				.then((response) => {
					resolve(response.data);
				})
				.catch((response) => {
					reject(`got ${response.status}  ${response.statusText}`)
				})
		})
	}

	/**
	 * Get a project by project_id
	 * @return {} project
	 */
	static getProject(project_id) {
		return new Promise((resolve, reject) => {
			AjaxUtil.get(`${window.PROJECT_URL}/${project_id}`)
				.then((response) => {
					resolve(response);
				})
				.catch((response) => {
					reject(`got ${response.status}  ${response.statusText}`)
				})
		})
	}

	/**
	 * Save a project by project_id
	 * @return {} project
	 */
	saveProject(project) {

		let url = `${window.PROJECT_URL}/${project.project_id}`;

		return new Promise((resolve, reject) => {
			AjaxUtil.put(url, project)
				.then((response) => {
					resolve(response);
				})
				.catch((response) => {
					reject(`got ${response.status}  ${response.statusText}`)
				})
		})
	}

}