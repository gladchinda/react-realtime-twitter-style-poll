import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import Loader from './Loader';
import PollDurationAndChoices from './PollDurationAndChoices';

const MAX_POST_LENGTH = 140;
const INITIAL_POLL = { duration: null, choices: null };

class NewPost extends Component {

	state = { user: null, hasPoll: false, post: '', postHeight: 0, poll: INITIAL_POLL, loading: false }

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

		this.setState({ loading: true });

		axios.post(`/api/posts`, data)
			.then(response => this.setState({ loading: false }, () => Router.replace('/')));
	}

	componentDidMount() {
		const { user = null } = this.props;
		user && this.setState({ user }, this.updatePostHeight);
	}

	render() {
		const { hasPoll, post, postHeight, loading } = this.state;

		const type = hasPoll ? 'Poll' : 'Post';
		const placeholder = hasPoll ? `What's the question?` : `What's happening?`;
		const pollButtonText = hasPoll ? 'Remove Poll' : 'Add Poll';

		return (
			<Fragment>

				<div className="position-fixed bg-white py-5 d-flex justify-content-center align-items-center" style={{ left: '20%', right: '20%', zIndex: 100 }}>

					<h1 className="h3 font-weight-bold mb-0 text-dark">{`New ${type}`}</h1>

					<div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-between">
						<Link prefetch replace passHref href="/">
							<button className="btn btn-link text-uppercase font-weight-bold px-0" style={{ lineHeight: 1, textDecoration: 'none' }}>All Posts</button>
						</Link>

						<div className="text-center">
							<button className={`btn btn-link py-0 text-uppercase font-weight-bold px-0${hasPoll ? ' text-danger' : ''}`} onClick={this.togglePoll} style={{ lineHeight: 1, textDecoration: 'none' }}>{pollButtonText}</button>
						</div>
					</div>

				</div>

				<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
					<div className="d-flex w-100 position-relative flex-wrap justify-content-center align-items-start align-content-start" style={{ maxWidth: 600 }}>

						<div className="w-100 mb-3">
							<textarea ref={e => this.post = e} className="border-bottom border-gray w-100 h3 px-3 py-2 font-weight-normal" placeholder={placeholder} value={post} rows="1" onChange={this.handlePostUpdate} style={{ resize: 'none', outline: 'none', boxShadow: 'none', border: 'none', lineHeight: 1.4, overflow: 'hidden', height: postHeight }} />

							<div className="w-100 text-right text-secondary font-weight-light">
								<span><small>{ (MAX_POST_LENGTH - post.length) || 'Limit exceeded' }</small></span>
							</div>
						</div>

						{ hasPoll && <PollDurationAndChoices onPollUpdated={this.onPollUpdated} /> }

						{this.canSubmit() && <button className="btn btn-info font-weight-bold text-uppercase mt-5 position-relative" style={{ height: 40, borderRadius: 20, fontSize: '0.8rem', lineHeight: 1, width: 140 }} onClick={this.handleSubmit} disabled={loading}>{ loading ? <Loader small light /> : `Create ${type}` }</button> }

					</div>
				</div>
			</Fragment>
		);
	}

}

export default NewPost;
