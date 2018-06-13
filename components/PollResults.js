import React, { Fragment } from 'react';

const PollResults = props => {

	const { votes = [], votedChoice = null } = props;
	const counts = votes.map(({ count }) => count);

	const maximumVote = Math.max(...counts);
	const totalVotes = counts.reduce((sum, count) => sum + count, 0);

	const VOTED_CHOICE = typeof votedChoice === 'number' ? [votedChoice] : null;

	return <Fragment>
		{ votes.map(({ choice, count }, index) => {

			const percentage = totalVotes && (count / totalVotes * 100);

			const relativeWidth = Math.min(100, Math.ceil(count / maximumVote * 100));
			const percentageForDisplay = percentage.toFixed(1).replace(/^(\d+)\.0$/, '$1');

			const choiceClass = [
				'w-50 d-inline-block position-relative text--small',
				(+VOTED_CHOICE === index) ? 'font-weight-bold text-dark' : ''
			].join(' ').trim().replace(/\s+/g, ' ');

			return (
				<div key={index} className="py-2 d-flex align-items-center poll-stat">

					<span className={choiceClass}>{choice}</span>

					<div className="w-50 d-flex justify-content-between align-items-center">
						<div className="w-75 d-flex justify-content-end">
							<div className="rounded poll-stat__vote-bar" style={{ width: `${relativeWidth}%` }}></div>
						</div>

						<span className="d-inline-block text--xsmall mr-3">{ `${percentageForDisplay}%` }</span>
					</div>

				</div>
			)

		}) }
	</Fragment>

}

export default PollResults;
