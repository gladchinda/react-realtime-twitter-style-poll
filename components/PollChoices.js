import React, { Component } from 'react';

const INITIAL_CHOICES = [null, null];
const MIN_CHOICES_COUNT = INITIAL_CHOICES.length;
const MAX_CHOICES_COUNT = MIN_CHOICES_COUNT + 2;

class PollChoices extends Component {

	state = { choices: INITIAL_CHOICES }

	addChoice = evt => {
		const [ ...choices ] = this.state.choices;
		choices.push(null);
		this.setState({ choices });
	}

	removeChoice = index => evt => {
		const [ ...currentChoices ] = this.state.choices;

		if (index >= 0 && index < currentChoices.length) {
			const choices = [
				...(currentChoices.slice(0, index)),
				...(currentChoices.slice(index + 1))
			];

			this.setState({ choices });
		}
	}

	updateChoice = index => evt => {
		const choice = evt.target.value;
		let [ ...choices ] = this.state.choices;

		if (index >= 0 && index < choices.length) {
			choices[index] = choice;
			this.setState({ choices });
		}
	}

	render() {
		const { choices } = this.state;
		const canAddChoices = choices.length < MAX_CHOICES_COUNT;

		return (
			<div className="d-flex flex-wrap justify-content-start w-100">

				{ choices.map((choice, index) => (
					<div key={index} className="w-100 py-2 d-flex justify-content-start">

						<input type="text" className="w-50 form-control position-relative" defaultValue="" value={choice} maxLength="50" placeholder={`Choice ${index + 1}`} onChange={this.updateChoice(index)} />

						{ (index >= MIN_CHOICES_COUNT) && <button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" onClick={this.removeChoice(index)} style={{ fontSize: '0.7rem', textDecoration: 'none' }}>Remove</button> }

					</div>
				)) }

				{ canAddChoices && <button className="btn btn-link text-uppercase font-weight-bold mt-3 px-0" onClick={this.addChoice} style={{ fontSize: '0.8rem', textDecoration: 'none' }}>+ Add Choice</button> }

			</div>
		)
	}

}

export default PollChoices;
