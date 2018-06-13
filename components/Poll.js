import React from 'react';
import PollChoices from './PollChoices';
import PollResults from './PollResults';

const Poll = props => {
	const { voted = false, votedChoice = null, votes = [], expires = null, post = null, user = null } = props;

	const isExpired = expires.isBefore();
	const enableVoting = !(isExpired || voted);

	return (
		<div className="w-100 pt-2 pb-2 text-secondary font-weight-normal">
			{ enableVoting
				? <PollChoices user={user} post={post} />
				: <PollResults votes={votes} votedChoice={votedChoice} />
			}
		</div>
	)
}

export default Poll;
