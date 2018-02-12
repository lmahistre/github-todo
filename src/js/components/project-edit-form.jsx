const React = require("react");

const AppPage = require("./app-page.jsx");
const CommonButton = require("./ui/common-button.jsx");

class ProjectEditForm extends React.Component {

	formFakeSubmit(event) {
		event.stopPropagation();
		event.preventDefault();
	}


	handleInputKeyDown(fnc, event) {
		if (event.which == 13) {
			fnc();
		}
	}


	changeVisible(event) {
		this.props.project.visible = event.target.checked;
		this.setState({
			project : this.props.project,
		});
	}


	render() {
		const self = this;
		return (
			<form name="project-edit" onSubmit={self.formFakeSubmit}>
				<input type="hidden" name="id" value={self.props.project.id} />
				<table className="form-table">
					<tbody>
						<tr>
							<td className="label">Name</td>
							<td className="value">
								<input type="text" name="name" defaultValue={self.props.project.name} onKeyDown={self.handleInputKeyDown.bind(self, self.props.save)} />
							</td>
						</tr>
						<tr>
							<td className="label">Visible</td>
							<td className="value">
								<input type="checkbox" name="visible" checked={self.props.project.visible} onChange={self.changeVisible.bind(self)} />
							</td>
						</tr>
						<tr>
							<td className="label">Color</td>
							<td className="value">
								<select name="color">
									<option value=""></option>
									{app.consts.colors.map(elt => (
										<option key={elt.id} value={elt.color} style={{backgroundColor : '#'+elt.color}} selected={elt.color == self.props.project.color}>{elt.name}</option>
									))}
								</select>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		);
	}
}

module.exports = ProjectEditForm;