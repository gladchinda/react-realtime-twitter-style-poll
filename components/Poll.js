import axios from 'axios';
import moment from 'moment';
import React, { Fragment } from 'react';

const Poll = props => {

	const { voted = false, votes = [], expires = null, created = null, post = null, user = null } = props;
	const { id: postId, choices } = post;

	const isExpired = expires.isBefore();
	const enableVoting = !(isExpired || voted);

	const totalVotes = votes.reduce((sum, count) => sum + count, 0);

	const handleVote = choice => evt => {
		axios.post(`/api/posts/${postId}/vote`, { user: user.id, choice })
	}

	return <Fragment>
		<div className="w-100 pt-2 pb-3 text-secondary font-weight-normal">
			{ enableVoting

				? choices.map((choice, index) => {

					const selected = false; // selectedChoice && selectedChoice === choice;

					const labelClass = ['custom-control-label pl-4 position-relative', selected ? 'checked' : ''].join(' ');

					const POSTID = `poll-response--radio--${postId}--${index}`

					return (
						<div key={index} className="custom-control custom-radio py-2 d-flex align-items-center">

							<input className="custom-control-input" type="radio" name="poll-response" id={POSTID} value={choice} />

							<label className={labelClass} htmlFor={POSTID} onClick={ handleVote(index) }>{choice}</label>

						</div>
					);

				})

				: (totalVotes || null) && choices.map((choice, index) => {
					const percentage = Math.floor(votes[index] / totalVotes * 100);

					return (
						<div key={index} className="py-2 d-flex align-items-center">
							<div className="d-flex justify-content-between align-items-center" style={{ width: '30%' }}>
								<div className="w-50" style={{ height: 4 }}>
									<div className="rounded bg-secondary" style={{ width: `${percentage}%`, height: 'inherit' }}></div>
								</div>
								<span className="text-dark"><small>{ `${percentage}%` }</small></span>
							</div>
							<span className="d-inline-block position-relative ml-5"><small>{choice}</small></span>
						</div>
					)
				})

			}
		</div>
	</Fragment>

}

export default Poll;
