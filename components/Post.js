import moment from 'moment';
import _range from 'lodash/range';
import React, { Component, Fragment } from 'react';
import Poll from '../components/Poll';

class Post extends Component {

	render() {
		// const { creator, people, post, poll, choices, created, id } = this.props;
		const { people, post, user } = this.props;
		const { post: postContent, poll, duration, votes, choices, creator, created } = post;

		const activeUser = people.find(person => person.id === user);
		const postCreator = people.find(person => person.id === creator);
		const postCreated = moment(created, 'X');

		let userVoted = false;
		let pollExpires = null;
		let pollVotes = null;

		if (poll) {
			userVoted = !!(votes.find(vote => vote.user === user));
			pollExpires = postCreated.clone().add(duration, 'm');

			const voteCounts = votes.reduce((stat, vote) => {
				const { choice } = vote;
				stat[choice] ? (stat[choice] += 1) : (stat[choice] = 1);
				return stat;
			}, []);

			pollVotes = _range(0, choices.length).map(choice => voteCounts[choice] || 0);
		}

		return <Fragment>
			<div className="rounded border border-gray w-100 position-relative p-3 mb-4">
				<div className="w-100 d-flex align-items-start justify-content-between">
					<div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white font-weight-bold h6 m-0" style={{ width: 40, height: 40 }}>
						<span>{ postCreator.name[0].toUpperCase() }</span>
					</div>
					<div className="d-flex flex-wrap align-items-start align-content-start pl-3" style={{ width: 'calc(100% - 40px)' }}>
						<div className="w-100 mb-3 h6 d-flex align-items-center">
							<span className="text-dark font-weight-bold">{ postCreator.name }</span>
							<span className="text-secondary font-weight-light ml-2">
								<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
									{ `@${postCreator.name.toLowerCase()}` }
								</small>
							</span>
							<span className="text-secondary font-weight-light ml-1">
								<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
									{ `${String.fromCharCode(8226)} ${ postCreated.fromNow(true) }` }
								</small>
							</span>
						</div>
						<div className="w-100 text-secondary font-weight-normal h5">{ postContent }</div>
						<div className="w-100 text-secondary font-weight-normal">
							{ poll && <Poll user={activeUser} voted={userVoted} votes={pollVotes} expires={pollExpires} created={postCreated} post={post} /> }
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	}

}

export default Post;
