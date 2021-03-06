
const React = require("react");

const SmallButton = require("../ui/small-button.jsx");
const Row = require("../ui/row.jsx");

const browserService = require('../../services/browser.js');
const utilsService = require('../../services/utils.js');
const L = require('../../services/i18n.js');
const reduxActions = require('../../services/redux-actions.js');
const store = require('../../services/store.js');

class NewTaskForm extends React.Component {

	handleInputKeyDown(event) {
		if (event.which == 13) {
			this.addTask();
		}
	}

	addTask() {
		const name = document.getElementById('new-task-name').value;
		if (name.length > 0) {
			let projectId = document.getElementById('new-task-projectId').value;
			let task = {
				name : name,
				projectId : projectId,
				status : 'active',
			};
			this.setState({
				name: '',
			});
			store.dispatch(reduxActions.addTask(task));
		}
	}

	onChangeName(event) {
		this.setState({
			name: event.target.value,
		});
	}

	onChangeProject (event) {
		store.dispatch(reduxActions.setSelectedProject(event.target.value));
		this.setState({
			projectId: event.target.value,
		});
	}

	constructor(props) {
		super();
		this.state = {
			name : '',
			projectId : props.settings && props.settings.projectId ? props.settings.projectId : '',
		};
	}

	render() {
		const self = this;
		return (
			<Row name="new-task" className="list-elt new-task-form">
				<div className="td" data-column="actions">
					<SmallButton fa="plus-circle" onClick={self.addTask.bind(self)} title={L("Add task")} color="blue" />
				</div>
				<div className="td" data-column="project">
					<select className="project-label" name="projectId" id="new-task-projectId" value={self.state.projectId} onChange={self.onChangeProject.bind(self)}>
						{self.props.projectList.map(elt => (
							<option key={elt.id} value={elt.id}>{elt.name}</option>
						))}
					</select>
				</div>
				<div className="td" data-column="name">
					<input id="new-task-name" type="text" name="name" value={self.state.name} onKeyDown={self.handleInputKeyDown.bind(self)} onChange={self.onChangeName.bind(self)} />
				</div>
			</Row>
		);
	}
}

module.exports = NewTaskForm;