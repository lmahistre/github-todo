const clone = require('clone');
const utils = require('./utils.js');


exports.DO_NOTHING = function (state, action) {
	return clone(state);
}


exports.DELETE_REMOVED_TASKS = function(state, action) {
	const newState = clone(state);
	for (let i in newState.tasks) {
		if (newState.tasks[i].status === 'removed' 
				&& action.currentTimestamp-newState.tasks[i].timestampModified > 365*86400) {
			delete newState.tasks[i];
		}
	}
	return newState;
}


exports.INIT = function(state, action) {
	return {
		tasks : action.tasks,
		projects : action.projects,
		settings : action.settings,
		alerts : [],
		busy : false,
	};
}


exports.SET_DATA = function(state, action) {
	const newState = clone(state);
	newState.tasks = action.tasks;
	newState.projects = action.projects;
	return newState;
}


exports.SET_TASK = function(state, action) {
	const newState = clone(state);
	if (action.task && action.task.id) {
		newState.tasks[action.task.id] = action.task;
	}
	if (newState.settings) {
		newState.settings.isSyncDirty = true;
	}
	return newState;
}


exports.SET_TASK_STATUS = function(state, action) {
	const newState = clone(state);
	newState.tasks[action.id].status = action.status;
	newState.tasks[action.id].timestampModified = action.currentTimestamp;
	if (newState.settings) {
		newState.settings.isSyncDirty = true;
	}
	return newState;
}


exports.REMOVE_RESOLVED_TASKS = function(state, action) {
	const newState = clone(state);
	let hasChanged = false;
	for (let i in newState.tasks) {
		if (newState.tasks[i].status === 'done') {
			newState.tasks[i].status = 'removed';
			newState.tasks[i].timestampModified = action.currentTimestamp;
			hasChanged = true;
		}
	}
	if (newState.settings) {
		newState.settings.isSyncDirty = newState.settings.isSyncDirty || hasChanged;
	}
	return newState;
}


exports.SET_PROJECT = function(state, action) {
	const newState = clone(state);
	if (action.project && action.project.id) {
		newState.projects[action.project.id] = action.project;
	}
	if (newState.settings) {
		newState.settings.isSyncDirty = true;
	}
	return newState;
}


exports.CHANGE_PROJECT_VISIBILITY = function(state, action) {
	const newState = clone(state);
	newState.projects[action.id].visible = !state.projects[action.id].visible;
	newState.projects[action.id].timestampModified = action.currentTimestamp;
	if (newState.settings) {
		newState.settings.isSyncDirty = true;
	}
	return newState;
}


exports.SET_BUSY = function(state, action) {
	const newState = clone(state);
	newState.busy = action.busy;
	return newState;
}


exports.REMOVE_PROJECT = function(state, action) {
	const newState = clone(state);
	if (newState.projects && action.id && newState.projects[action.id]) {
		if (utils.projectIsUsedByVisibleTasks(action.id, newState.tasks)) {
			newState.alerts.push({
				type : 'error',
				message : 'Project '+action.id+' is still in use',
			});
		}
		else {
			newState.projects[action.id].status = 'removed';
			newState.projects[action.id].timestampModified = action.timestampModified;
		}
	}
	if (newState.settings) {
		newState.settings.isSyncDirty = true;
	}
	return newState;
}


exports.SET_SELECTED_PROJECT = function(state, action) {
	const newState = clone(state);
	newState.settings.projectId = action.id;
	return newState;
}


exports.IMPORT_SETTINGS = function(state, action) {
	const newState = clone(state);
	newState.settings.user = action.settings.user;
	newState.settings.gistId = action.settings.gistId;
	newState.settings.token = action.settings.token;
	newState.settings.isSyncDirty = true;
	if (action.settings.fileName) {
		newState.settings.fileName = action.settings.fileName;
	}
	return newState;
}


exports.SET_SETTINGS = function(state, action) {
	const newState = clone(state);
	if (newState.settings 
		&& (newState.settings.user != action.settings.user
			|| newState.settings.gistId != action.settings.gistId
			|| newState.settings.token != action.settings.token
			|| newState.settings.fileName != action.settings.fileName
			|| newState.settings.backgroundImage != action.settings.backgroundImage
			|| newState.settings.warnIfDirty != action.settings.warnIfDirty
		)
	) {
		newState.settings.isSyncDirty = true;
	}
	newState.settings.user = action.settings.user;
	newState.settings.gistId = action.settings.gistId;
	newState.settings.token = action.settings.token;
	newState.settings.language = action.settings.language;
	if (action.settings.fileName) {
		newState.settings.fileName = action.settings.fileName;
	}
	newState.settings.warnIfDirty = action.settings.warnIfDirty;
	return newState;
}


exports.SET_IMPORT_PROJECTS = function(state, action) {
	const newState = clone(state);
	newState.importProjects = action.importProjects ? action.importProjects : [];
	newState.busy = false;
	return newState;
}


exports.ADD_ALERT = function(state, action) {
	const newState = clone(state);
	newState.alerts.push({
		type : action.alertType,
		message : action.message,
	});
	return newState;
}


exports.CLEAR_ALERT = function(state, action) {
	const newState = clone(state);
	if (newState.alerts && newState.alerts[action.index]) {
		newState.alerts.splice(action.index, 1);
	}
	return newState;
}


exports.END_SYNC = function(state, action) {
	const newState = clone(state);
	newState.busy = false;
	if (newState.settings) {
		newState.settings.isSyncDirty = false;
	}
	return newState;
}


exports.CHANGE_LANGUAGE = function (state, action) {
	const newState = clone(state);
	newState.settings.language = action.language;
	return newState;
}