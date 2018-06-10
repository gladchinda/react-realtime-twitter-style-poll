import axios from 'axios';
import moment from 'moment';
import React, { Fragment } from 'react';

const Poll = props => {

	const { voted = false, votes = [], expires = null, created = null, post = null, user = null } = props;
	const { id: postId, choices } = post;

	const isExpired = expires.isBefore();
	const enableVoting = !(isExpired || voted);

	const totalVotes = votes.reduce((sum, count) => sum + count, 0);
	const maximumVote = Math.max(...votes);

	const handleVote = choice => evt => {
		axios.post(`/api/posts/${postId}/vote`, { user: user.id, choice })
	}

	return <Fragment>
		<div className="w-100 pt-2 pb-2 text-secondary font-weight-normal">
			{ enableVoting

				? choices.map((choice, index) => {

					const selected = false; // selectedChoice && selectedChoice === choice;

					const labelClass = ['custom-control-label pl-4 position-relative', selected ? 'checked' : ''].join(' ');

					const POSTID = `poll-response--radio--${postId}--${index}`

					return (
						<div key={index} className="custom-control custom-radio px-0 py-2 d-flex align-items-center">

							<input className="custom-control-input" type="radio" name="poll-response" id={POSTID} value={choice} />

							<label className={labelClass} htmlFor={POSTID} onClick={ handleVote(index) }>
								<small>{choice}</small>
							</label>

						</div>
					);

				})

				: (totalVotes || null) && choices.map((choice, index) => {

					const percentage = votes[index] / totalVotes * 100;
					const relativeWidth = Math.min(100, Math.ceil(votes[index] / maximumVote * 100));
					const percentageForDisplay = percentage.toFixed(1).replace(/^(\d+)\.0$/, '$1');

					return (
						<div key={index} className="py-2 d-flex align-items-center">
							<span className="w-50 d-inline-block position-relative"><small>{choice}</small></span>
							<div className="w-50 d-flex justify-content-between align-items-center">
								<div className="w-75 d-flex justify-content-end">
									<div className="rounded" style={{ width: `${relativeWidth}%`, height: 4, background: '#ddd' }}></div>
								</div>
								<span className="d-inline-block mr-3">
									<small className="align-text-top" style={{ fontSize: '70%' }}>{`${percentageForDisplay}%`}</small>
								</span>
							</div>
						</div>
					)
				})

			}
		</div>
	</Fragment>

}

export default Poll;
