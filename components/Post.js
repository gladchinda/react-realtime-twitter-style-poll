import moment from 'moment';
import _range from 'lodash/range';
import React, { Component, Fragment } from 'react';
import Poll from '../components/Poll';

class Post extends Component {

	render() {
		const { people, post, user } = this.props;
		const { post: postContent, poll, duration, votes, choices, creator, created } = post;

		const activeUser = people.find(person => person.id === user);
		const postCreator = people.find(person => person.id === creator);
		const postCreated = moment(created, 'X');

		const now = moment();
		const postCreatedDisplay = postCreated.fromNow(true).replace(/^an/, '1').replace(/^(\d+) (.).+$/, `$1$2 ago`);

		let userVoted = false;
		let pollExpires = null;
		let pollExpired = false;
		let pollVotes = null;
		let totalVotes = 0;

		if (poll) {
			userVoted = !!(votes.find(vote => vote.user === user));
			pollExpires = postCreated.clone().add(duration, 'm');
			pollExpired = pollExpires.isBefore();

			const voteCounts = votes.reduce((stat, vote) => {
				const { choice } = vote;
				stat[choice] ? (stat[choice] += 1) : (stat[choice] = 1);
				return stat;
			}, []);

			pollVotes = _range(0, choices.length).map(choice => voteCounts[choice] || 0);
			totalVotes = pollVotes.reduce((sum, count) => sum + count, 0);
		}

		return <Fragment>
			<div className="bg-white rounded border border-gray w-100 position-relative p-3 mb-4">
				<div className="w-100 d-flex align-items-start justify-content-between">
					<div className="rounded-circle bg-light d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
						<img className="rounded img-fluid" src={postCreator.avatar} alt={postCreator.name} title={postCreator.name} />
					</div>
					<div className="d-flex flex-wrap align-items-start align-content-start pl-3" style={{ width: 'calc(100% - 40px)' }}>
						<div className="w-100 mb-2 h6 d-flex justify-content-between align-items-center">
							<div className="d-flex align-items-center">
								<span className="text-dark font-weight-bold">{ postCreator.name }</span>
								<span className="text-secondary font-weight-light ml-2">
									<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
										{ `@${postCreator.name.toLowerCase()}` }
									</small>
								</span>
								<span className="text-secondary font-weight-light ml-1">
									<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
										{ `${String.fromCharCode(8226)} ${ postCreatedDisplay }` }
									</small>
								</span>
							</div>
							{ poll && <div className="d-flex align-items-center mr-3">
								<span className="text-secondary font-weight-light ml-1">
									<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
										{ `${totalVotes || 'No'} vote${totalVotes === 1 ? '' : 's'} ${String.fromCharCode(8226)} ${ pollExpired ? 'Poll ended' : `${pollExpires.diff(now, 'm')}m left`}`}
									</small>
								</span>
							</div> }
						</div>
						<div className="w-100 text-secondary pl-3 my-1" style={{ borderLeft: '1px solid #eee' }}>
							<div className="h6 my-0 py-2 font-weight-normal" style={{ lineHeight: 1.5 }}>{ postContent }</div>
							<div>
								{ poll && <Poll user={activeUser} voted={userVoted} votes={pollVotes} expires={pollExpires} created={postCreated} post={post} /> }
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	}

}

export default Post;
