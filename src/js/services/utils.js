
const constsService = require('./consts.js');
const dataContainerService = require('./data-container.js');

/**
 * Transform the technical name of the project into human readable name
 */
exports.renameProject = function(name) {
	name = name.replace(/-/g, ' ');
	name = name.replace(/_/g, ' ');
	name = name.replace(/  /g, ' ');
	const elts = name.split(' ');
	for (var i = 0; i < elts.length; i++) {
		elts[i] = elts[i][0].toUpperCase()+elts[i].slice(1);
	}
	return elts.join(' ');
}


/**
 * Returns a random color, among the least used colors
 */
exports.generateRandomColor = function() {
	// selection of a random color
	const colors = {};
	const projects = dataContainerService.getProjects();
	for (let i = 0; i < constsService.colors.length; i++) {
		colors[constsService.colors[i].color] = 0;
	}
	for (let i in projects) {
		if (colors[projects[i].color] !== undefined) {
			colors[projects[i].color]++;
		}
	}
	// search for minimum
	let minColor;
	for (let color in colors) {
		if (typeof minColor === 'undefined') {
			minColor = colors[color];
		}
		else {
			minColor = Math.min(minColor, colors[color]);
		}
	}
	const selectableColors = [];
	for (let color in colors) {
		if (colors[color] == minColor) {
			selectableColors.push(color);
		}
	}

	const randomIndex = parseInt(Math.random() * selectableColors.length);
	return selectableColors[randomIndex];
}


exports.generateRandomId = function () {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const idLength = 8;
	let id = '';
	for (var i = 0; i < idLength; i++) {
		id += alphabet[parseInt(Math.random()*alphabet.length)];
	}
	return id;
}


exports.getNextProjectId = function() {
	const projects = dataContainerService.getProjects();
	let id = exports.generateRandomId();
	let idIsUnique = false;
	while (!idIsUnique) {
		idIsUnique = true;
		if (projects) {
			for (let i in projects) {
				if (projects[i].id === id) {
					id = exports.generateRandomId();
					idIsUnique = false;
					break;
				}
			}
		}
	}
	// id++;
	return id;
}