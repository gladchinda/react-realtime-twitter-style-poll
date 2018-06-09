import axios from 'axios';
import Router from 'next/router';
import React, { Component } from 'react';
import PollDurationAndChoices from './PollDurationAndChoices';

const MAX_POST_LENGTH = 140;
const INITIAL_POLL = { duration: null, choices: null };

class NewPost extends Component {

	state = { user: null, hasPoll: false, post: '', postHeight: 0, poll: INITIAL_POLL }

	togglePoll = evt => this.setState({ hasPoll: !this.state.hasPoll, poll: INITIAL_POLL })

	updatePostHeight = () => this.setState({ postHeight: this.post.scrollHeight })

	handlePostUpdate = evt => {
		const post = evt.target.value;
		(post.length <= MAX_POST_LENGTH) && this.setState({ post }, this.updatePostHeight);
	}

	onPollUpdated = ({ duration, choices }) => {
		const { ...currentPoll } = this.state.poll;
		this.setState({ poll: { ...currentPoll, duration, choices } });
	}

	canSubmit = () => {
		const { hasPoll, post, poll: { duration, choices } } = this.state;
		const canSubmitPoll = duration && choices && (choices.filter(choice => !choice).length === 0);

		return !post ? false : hasPoll ? canSubmitPoll : true;
	}

	handleSubmit = () => {
		const { user: creator = null, post, hasPoll: poll, poll: { duration, choices } } = this.state;
		const data = { post, poll, choices, duration, creator };

		axios.post(`/api/posts`, data)
			.then(response => Router.replace('/'));
	}

	componentDidMount() {
		const { user = null } = this.props;
		user && this.setState({ user }, this.updatePostHeight);
	}

	render() {
		const { hasPoll, post, postHeight } = this.state;

		const type = hasPoll ? 'Poll' : 'Post';
		const placeholder = hasPoll ? `What's the question?` : `What's happening?`;
		const pollButtonText = hasPoll ? 'Remove Poll' : 'Add Poll';

		return (
			<div className="d-flex w-100 position-relative flex-wrap justify-content-center align-items-start align-content-start" style={{ maxWidth: 600 }}>

				<div className="mb-5 pb-5 text-center">
					<h1 className="h2 font-weight-bold mb-3 text-dark">{ `New ${type}` }</h1>
					<button className="btn btn-outline-info py-0 text-uppercase font-weight-bold" onClick={ this.togglePoll } style={{ height: 36, borderRadius: 18, borderWidth: 2, fontSize: '0.75rem', lineHeight: 1, width: 120 }}>{ pollButtonText }</button>
				</div>

				<div className="w-100 mb-3">
					<textarea ref={e => this.post = e} className="border-bottom border-gray w-100 h3 px-3 py-2 font-weight-normal" placeholder={placeholder} value={post} rows="1" onChange={this.handlePostUpdate} style={{ resize: 'none', outline: 'none', boxShadow: 'none', border: 'none', lineHeight: 1.4, overflow: 'hidden', height: postHeight }} />

					<div className="w-100 text-right text-secondary">
						<span><small>{ (MAX_POST_LENGTH - post.length) || 'Limit exceeded' }</small></span>
					</div>
				</div>

				{ hasPoll && <PollDurationAndChoices onPollUpdated={this.onPollUpdated} /> }

				{ this.canSubmit() && <button className="btn btn-info font-weight-bold text-uppercase mt-5" style={{ height: 48, borderRadius: 24, lineHeight: 1, width: 160 }} onClick={this.handleSubmit}> { `Create ${type}` }</button> }

			</div>
		);
	}

}

export default NewPost;
