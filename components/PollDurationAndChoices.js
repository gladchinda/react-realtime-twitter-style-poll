import React, { Component } from 'react';

const INITIAL_CHOICES = [null, null];
const MIN_CHOICES_COUNT = INITIAL_CHOICES.length;
const MAX_CHOICES_COUNT = MIN_CHOICES_COUNT + 2;

const POLL_DURATIONS = [60, 30, 15, 5, 1];

class PollDurationAndChoices extends Component {

	state = { choices: INITIAL_CHOICES, duration: POLL_DURATIONS[0] }

	addChoice = evt => {
		const [ ...choices ] = this.state.choices;
		choices.push(null);
		this.setState({ choices }, this.afterPollUpdated);
	}

	removeChoice = index => evt => {
		const [ ...currentChoices ] = this.state.choices;

		if (index >= 0 && index < currentChoices.length) {
			const choices = [
				...(currentChoices.slice(0, index)),
				...(currentChoices.slice(index + 1))
			];

			this.setState({ choices }, this.afterPollUpdated);
		}
	}

	updateChoice = index => evt => {
		const choice = evt.target.value;
		let [ ...choices ] = this.state.choices;

		if (index >= 0 && index < choices.length) {
			choices[index] = choice;
			this.setState({ choices }, this.afterPollUpdated);
		}
	}

	updateDuration = duration => evt => {
		this.setState({ duration: Math.max(1, Math.min(60, +duration)) }, this.afterPollUpdated);
	}

	afterPollUpdated = () => {
		const { ...currentState } = this.state;
		const { onPollUpdated = f => f } = this.props;
		onPollUpdated(currentState);
	}

	render() {
		const { choices } = this.state;
		const canAddChoices = choices.length < MAX_CHOICES_COUNT;

		return (
			<div className="d-flex flex-wrap justify-content-start w-100">

				<div className="mb-5 w-100">

					{ choices.map((choice, index) => (
						<div key={index} className="w-100 py-2 d-flex justify-content-start">

							<input type="text" className="w-50 form-control position-relative" value={choice || ''} maxLength="50" placeholder={`Choice ${index + 1}`} onChange={this.updateChoice(index)} />

							{ (index >= MIN_CHOICES_COUNT) && <button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" onClick={this.removeChoice(index)} style={{ fontSize: '0.7rem', textDecoration: 'none' }}>Remove</button> }

						</div>
					)) }

					{ canAddChoices && <button className="btn btn-link text-uppercase font-weight-bold mt-4 px-0" onClick={this.addChoice} style={{ fontSize: '0.8rem', textDecoration: 'none' }}>+ Add Choice</button> }

				</div>

				<div className="w-100 border-top border-bottom py-4 border-gray d-flex justify-content-between align-items-center">
					<span className="font-weight-bold text-uppercase text-secondary mx-2">Duration</span>
					<div className="mx-2">
						{ POLL_DURATIONS.map((duration, index) => {
							const currentDuration = duration === this.state.duration;

							return <button key={index} className={`btn mr-2 my-2 font-weight-bold ${currentDuration ? 'btn-primary' : 'btn-secondary'}`} disabled={currentDuration} style={{ height: 36, borderRadius: 18, fontSize: '0.75rem', lineHeight: 1, width: 75 }} onClick={this.updateDuration(duration)}>
								{ duration % 60 ? `${duration} ${duration > 1 ? 'mins' : 'min'}` : `${duration / 60} hour` }
							</button>
						}) }
					</div>
				</div>

			</div>
		)
	}

}

export default PollDurationAndChoices;
