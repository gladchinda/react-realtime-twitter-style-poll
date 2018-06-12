import axios from 'axios';
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

	terminatePost = () => {
		const { onTerminatePost = f => f } = this.props;
		onTerminatePost();
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
			.then(response => this.setState({ loading: false }, this.terminatePost))
			.catch(() => this.setState({ loading: false }));
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

		const plainButtonClass = 'btn btn-link text-uppercase font-weight-bold px-0 text--small button--plain';

		return (
			<Fragment>

				<div className="w-100 position-fixed bg-white py-5 d-flex justify-content-center align-items-center topbar topbar--post">

					<h1 className="h3 font-weight-bold mb-0 text-dark d-none d-sm-block">{`New ${type}`}</h1>

					<div className="position-absolute h-100 w-100 d-flex align-items-center justify-content-between topbar topbar--post">
						<button className={plainButtonClass} onClick={this.terminatePost}>All Posts</button>

						<div className="text-center">
							<button className={`${plainButtonClass}${hasPoll ? ' text-danger' : ''}`} onClick={this.togglePoll}>{pollButtonText}</button>
						</div>
					</div>

				</div>

				<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center min-w-560 max-w-640">
					<div className="d-flex w-100 position-relative flex-wrap justify-content-center align-items-start align-content-start">

						<div className="w-100 mb-3">
							<textarea ref={e => this.post = e} className="border-bottom border-gray w-100 h3 px-3 py-2 font-weight-normal post--textarea" placeholder={placeholder} value={post} rows="1" onChange={this.handlePostUpdate} style={{ height: postHeight }} />

							<div className="w-100 text-right text-secondary font-weight-light">
								<span><small>{ (MAX_POST_LENGTH - post.length) || 'Limit exceeded' }</small></span>
							</div>
						</div>

						{ hasPoll && <PollDurationAndChoices onPollUpdated={this.onPollUpdated} /> }

						{ this.canSubmit() && <button className="btn btn-info font-weight-bold text-uppercase mt-5 position-relative button--rounded" onClick={this.handleSubmit} disabled={loading}>
							{ loading ? <Loader small light /> : `Create ${type}` }
						</button> }

					</div>
				</div>
			</Fragment>
		);
	}

}

export default NewPost;
