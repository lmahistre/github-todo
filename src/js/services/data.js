
const storageService = require('./storage.js');


exports.getProjects = storageService.getProjects;


exports.getProject = function (id) {
	const projects = exports.getProjects();
	return projects[id];
}


exports.setProjects = function (value) {
	storageService.save({
		projects : value,
	});
}


exports.setProject = function (id, obj) {
	const projects = exports.getProjects();
	projects[id] = obj;
	storageService.save({
		projects : projects,
	});
}


exports.deleteProject = function(id) {
	const projects = exports.getProjects();
	if (projects[id]) {
		delete projects[id];
		storageService.save({projects});
		return true;
	}
	return false;
}


exports.getTasks = storageService.getTasks;

exports.setTasks = function (value) {
	storageService.save({
		tasks : value,
	});
}


exports.getTask = function (id) {
	const tasks = exports.getTasks();
	return tasks[id];
}


exports.setTask = function (id, obj) {
	const tasks = exports.getTasks();
	tasks[id] = obj;
	storageService.save({tasks});
}


exports.deleteTask = function(id) {
	const tasks = exports.getTasks();
	if (tasks[id]) {
		delete tasks[id];
		return true;
		storageService.save({tasks});
	}
	return false;
}


exports.getImportProjects = storageService.getImportProjects;

exports.setImportProjects = function (value) {
	storageService.save({
		importProjects : value,
	});
}


exports.getSettings = storageService.getSettings;

exports.setSettings = function (value) {
	settings = value;
}


exports.setSetting = function (id, obj) {
	const settings = exports.getSettings();
	settings[id] = obj;
	storageService.save({settings});
}
