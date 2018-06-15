import axios from 'axios';
import React, { Component, Fragment } from 'react';

class PollChoices extends Component {

	state	= { voting: false }

	handleVote = choice => evt => {
		const { post, user } = this.props;
		const { id: POSTID } = post;

		this.setState({ voting: true }, () => {
			axios.post(`/api/posts/${POSTID}/vote`, { user: user.id, choice })
				.then(() => this.setState({ voting: false }));
		});
	}

	render() {
		const { post } = this.props;
		const { id: postID, choices } = post;

		return <Fragment>
			{ choices.map((choice, index) => {

				const POSTID = `poll-response--radio--${postID}--${index}`;

				const labelClass = 'custom-control-label pl-4 position-relative';

				return (
					<div key={index} className="custom-control custom-radio px-0 py-2 d-flex align-items-center">

						<input className="custom-control-input" type="radio" name="poll-response" id={POSTID} value={choice} />

						<label className={labelClass} htmlFor={POSTID} onClick={ this.handleVote(index) }>
							<small>{choice}</small>
						</label>

					</div>
				);

			}) }
		</Fragment>
	}

}

export default PollChoices;
