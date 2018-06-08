import React, { Component } from 'react';

const INITIAL_CHOICES = [ null, null ];
const MIN_CHOICES_COUNT = INITIAL_CHOICES.length;
const MAX_CHOICES_COUNT = MIN_CHOICES_COUNT + 2;

const MAX_POST_LENGTH = 140;

class NewPost extends Component {

	state = { hasPoll: false, choices: INITIAL_CHOICES, post: '', postHeight: 0 }

	togglePoll = evt => {
		let { hasPoll, choices: [ ...choices ] } = this.state;
		hasPoll && (choices = INITIAL_CHOICES);
		this.setState({ hasPoll: !hasPoll, choices });
	}

	updatePostHeight() {
		const postHeight = this.post.scrollHeight;
		this.setState({ postHeight });
	}

	handlePostUpdate = evt => {
		const post = evt.target.value;
		(post.length <= MAX_POST_LENGTH) && this.setState({ post }, this.updatePostHeight);
	}

	updateChoice = index => evt => {
		const choice = evt.target.value;
		let [ ...choices ] = this.state.choices;

		if (index >= 0 && index < choices.length) {
			choices[index] = choice;
			this.setState({ choices });
		}
	}

	addChoice = evt => {
		const [ ...choices ] = this.state.choices;
		choices.push(null);
		this.setState({ choices });
	}

	removeChoice = index => evt => {
		const [ ...currentChoices ] = this.state.choices;

		if (index >= 0 && index < currentChoices.length) {
			const choices = [ ...(currentChoices.slice(0, index)), ...(currentChoices.slice(index + 1)) ];
			this.setState({ choices });
		}
	}

	componentDidMount() {
		this.updatePostHeight();
	}

	render() {
		const { hasPoll, post, postHeight, choices } = this.state;

		const title = `New ${hasPoll ? 'Poll' : 'Post'}`;
		const placeholder = hasPoll ? `What's the question?` : `What's happening?`;
		const pollButtonText = hasPoll ? 'Remove Poll' : 'Add Poll';

		return (
			<div className="d-flex w-100 position-relative flex-wrap justify-content-center align-items-start align-content-start" style={{ maxWidth: 600 }}>

				<div className="mb-5 pb-5 text-center">
					<h1 className="h2 font-weight-bold mb-3 text-dark">{title}</h1>
					<button className="btn btn-outline-info py-0 text-uppercase font-weight-bold" onClick={ this.togglePoll } style={{ height: 36, borderRadius: 18, borderWidth: 2, fontSize: '0.75rem', lineHeight: 1, width: 120 }}>{ pollButtonText }</button>
				</div>

				<div className="w-100">
					<textarea ref={e => this.post = e} className="border-bottom border-gray w-100 h3 px-3 py-2 font-weight-normal" placeholder={placeholder} value={post} rows="1" onChange={this.handlePostUpdate} style={{ resize: 'none', outline: 'none', boxShadow: 'none', border: 'none', lineHeight: 1.4, overflow: 'hidden', height: postHeight }} />

					<div className="w-100 text-right text-secondary">
						<span><small>{ (MAX_POST_LENGTH - post.length) || 'Limit exceeded' }</small></span>
					</div>
				</div>

				{ hasPoll && <div className="d-flex flex-wrap justify-content-start w-100">
					{ choices.map((choice, index) => (
						<div key={index} className="w-100 py-2 d-flex justify-content-start">
							<input type="text" className="w-50 form-control position-relative" defaultValue="" value={choice} maxLength="50" placeholder={`Choice ${index + 1}`} onChange={this.updateChoice(index)} />
							{ (index >= MIN_CHOICES_COUNT) && <button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" onClick={this.removeChoice(index)} style={{ fontSize: '0.7rem', textDecoration: 'none' }}>Remove</button> }
						</div>
					)) }
					{ (choices.length < MAX_CHOICES_COUNT) && <button className="btn btn-link text-uppercase font-weight-bold mt-3 px-0" onClick={this.addChoice} style={{ fontSize: '0.8rem', textDecoration: 'none' }}>+ Add Choice</button> }
				</div> }

			</div>
		);
	}

}

export default NewPost;
