const React = require("react");

const SmallButton = require("./ui/small-button.jsx");

const actionsService = require('../services/actions.js');
const browserService = require('../services/browser.js');
const dataContainerService = require('../services/data-container.js');

class Task extends React.Component {

	resolve(id) {
		const task = dataContainerService.getTask(id);
		if (task) {
			task.status = 'done';
		}
		dataContainerService.setTask(id, task);
		actionsService.saveData();
		browserService.render();
	}


	delete(id) {
		if (app.state.data.tasks[id]) {
			delete app.state.data.tasks[id];
		}
		app.services.saveData();
		browserService.render();
	}


	unresolve(id) {
		if (app.state.data.tasks[id]) {
			app.state.data.tasks[id].status = 'active';
		}
		actionsService.saveData();
		browserService.render();
	}


	edit() {
		const self = this;
		self.setState({
			isBeingEdited : true,
		});
	}


	cancel() {
		const self = this;
		self.setState({
			isBeingEdited : false,
		});
	}


	save() {
		const self = this;
		self.setState({
			isBeingEdited : false,
		});
		const id = self.props.task.id;
		const name = document.getElementById("task-edit-name-"+id).value;
		let projectId = parseInt(document.getElementById("task-edit-projectId-"+id).value);
		if (isNaN(projectId)) {
			projectId = 0;
		}
		const task = {
			id : id,
			name : name,
			projectId : projectId,
		};
		dataContainerService.setTask(id, task);
		actionsService.saveData();

		// if (app.state.data.tasks[id].name != task.name 
		// 		|| app.state.data.tasks[id].projectId != task.projectId) {
		// 	app.state.data.tasks[id] = task;
		// 	actionsService.saveData();
		// 	app.render();
		// }
	}


	handleInputKeyDown(event) {
		if (event.which == 13) {
			this.save();
		}
	}


	render() {
		const self = this;
		const elt = self.props.task;

		if (self.state && self.state.isBeingEdited) {
			const projectList = [
				{
					id : 0,
					name : '',
					color : '',
				}
			];
			const projects = dataContainerService.getProjects();
			for (let i in projects) {
				let project = projects[i];
				projectList.push(project);
			}
			return (
				<tr className={"status-"+elt.status}>
					<td className="actions">
						<SmallButton glyphicon="remove" onClick={self.cancel.bind(self)} title={"Cancel"} />
						<SmallButton glyphicon="ok" onClick={self.save.bind(self)} title={"Save"} />
					</td>
					<td>
						<select id={"task-edit-projectId-"+elt.id} name="projectId" defaultValue={elt.projectId}>
							{projectList.map(opt => (
								<option key={opt.id} value={opt.id}>{opt.name}</option>
							))}
						</select>
					</td>
					<td>
						<input id={"task-edit-name-"+elt.id} type="text" name="name" defaultValue={elt.name} onKeyDown={this.handleInputKeyDown.bind(this)} />
					</td>
				</tr>
			);
		}
		else {
			return (
				<tr className={"status-"+elt.status}>
					<td className="actions">
						{elt.status == 'done' ? 
							[
								<SmallButton key={0} glyphicon="trash" onClick={self.delete.bind(self, elt.id)} title={"Delete"} />,
								<SmallButton key={1} glyphicon="folder-open" onClick={self.unresolve.bind(self, elt.id)} title={"Reopen"} />
							]
						:
							[
								<SmallButton key={0} glyphicon="edit" onClick={self.edit.bind(self, elt.id)} title={"Edit"} />,
								<SmallButton key={1} glyphicon="ok" onClick={self.resolve.bind(self, elt.id)} title={"Resolve"} />
							]
						}
					</td>
					<td>
						<div className="project-label" style={{backgroundColor : '#'+elt.projectColor}} title={elt.projectName} data-tip={elt.projectName}>{elt.projectName}</div>
					</td>
					<td>{elt.name}</td>
				</tr>
			);
		}
	}
}

module.exports = Task;