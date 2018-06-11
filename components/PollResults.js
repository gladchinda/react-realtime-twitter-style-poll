import React, { Fragment } from 'react';

const PollResults = props => {

	const { votes = [] } = props;
	const counts = votes.map(({ count }) => count);

	const maximumVote = Math.max(...counts);
	const totalVotes = counts.reduce((sum, count) => sum + count, 0);

	return <Fragment>
		{ votes.map(({ choice, count }, index) => {

			const percentage = totalVotes && (count / totalVotes * 100);

			const relativeWidth = Math.min(100, Math.ceil(count / maximumVote * 100));
			const percentageForDisplay = percentage.toFixed(1).replace(/^(\d+)\.0$/, '$1');

			return (
				<div key={index} className="py-2 d-flex align-items-center">

					<span className="w-50 d-inline-block position-relative"><small>{choice}</small></span>

					<div className="w-50 d-flex justify-content-between align-items-center">
						<div className="w-75 d-flex justify-content-end">
							<div className="rounded" style={{ width: `${relativeWidth}%`, height: 4, background: '#ddd' }}></div>
						</div>

						<span className="d-inline-block mr-3">
							<small className="align-text-top" style={{ fontSize: '70%' }}>
								{`${percentageForDisplay}%`}
							</small>
						</span>
					</div>

				</div>
			)

		}) }
	</Fragment>

}

export default PollResults;
