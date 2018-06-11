import moment from 'moment';
import _range from 'lodash/range';
import React, { Component, Fragment } from 'react';
import Poll from '../components/Poll';

class Post extends Component {

	constructor(props) {
		super(props);

		const { people, post, user } = props;
		const { post: postContent, poll, duration, creator, created } = post;

		this.activeUser = user;
		this.postCreator = people.find(person => person.id === creator);

		this.postContent = postContent;
		this.postCreated = moment(created, 'X');
		this.pollExpires = poll ? this.postCreated.clone().add(duration, 'm') : null;

		this.state = { postCreatedDisplay: null, pollExpiresDisplay: null, pollExpired: false };
	}

	resetTimer = () => {
		this.timer && clearTimeout(this.timer);
	}

	getPollLifetimeData = () => {
		const now = moment();
		const { poll } = this.props.post;

		let data = { pollExpired: false, pollExpiresDisplay: null, expires: null };

		if (poll) {
			const expiresMin = Math.max(0, this.pollExpires.diff(now, 'm'));
			const expiresSec = Math.max(0, this.pollExpires.diff(now, 's'));

			const pollExpired = this.pollExpires.isBefore();
			const pollExpiresDisplay = (expiresSec < 60) ? `${expiresSec}s` : `${expiresMin}m`;

			data = { ...data, pollExpired, pollExpiresDisplay, expires: expiresSec };
		}

		return data;
	}

	updatePostTimers = () => {
		const { expires, pollExpired, pollExpiresDisplay } = this.getPollLifetimeData();
		this.pollTimer && (expires === 0) && this.clearInterval(this.pollTimer);

		if (!this.pollTimer && Math.ceil(expires / 60) <= 2) {
			setTimeout(() => this.pollTimer = setInterval(() => {
				const { pollExpired, pollExpiresDisplay } = this.getPollLifetimeData();
				this.setState({ pollExpired, pollExpiresDisplay });
			}, 1000), Math.max(1, expires - 60) * 1000);
		}

		const postCreatedDisplay = this.postCreated.fromNow(true)
			.replace('a few seconds', 'just now')
			.replace(/^an?/, '1')
			.replace(/^(\d+) (.).+$/, `$1$2 ago`);

		const data = { postCreatedDisplay, pollExpired, pollExpiresDisplay };

		this.setState(data, () => this.timer = setTimeout(this.updatePostTimers, 60 * 1000));
	}

	componentWillUnmount() {
		this.resetTimer();
	}

	componentDidMount() {
		this.updatePostTimers();
	}

	render() {

		const { post } = this.props;
		const { poll, votes, choices } = post;
		const { postCreatedDisplay, pollExpiresDisplay, pollExpired } = this.state;

		let userVoted = false;
		let pollVotes = null;
		let totalVotes = 0;

		if (poll) {
			userVoted = !!(votes.find(vote => vote.user === this.activeUser.id));

			const voteCounts = votes.reduce((stat, vote) => {
				const { choice } = vote;
				stat[choice] ? (stat[choice] += 1) : (stat[choice] = 1);
				return stat;
			}, []);

			pollVotes = _range(0, choices.length).map(choice => ({
				choice: choices[choice],
				count: voteCounts[choice] || 0
			}));

			totalVotes = pollVotes.map(vote => vote.count).reduce((sum, count) => sum + count, 0);
		}

		return !(this.activeUser || this.postCreator) ? null : <Fragment>
			<div className="bg-white rounded border border-gray w-100 position-relative p-3 mb-4">
				<div className="w-100 d-flex align-items-start justify-content-between">
					<div className="rounded-circle bg-light d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
						<img className="rounded img-fluid" src={this.postCreator.avatar} alt={this.postCreator.name} title={this.postCreator.name} />
					</div>
					<div className="d-flex flex-wrap align-items-start align-content-start pl-3" style={{ width: 'calc(100% - 40px)' }}>
						<div className="w-100 mb-2 h6 d-flex justify-content-between align-items-center">
							<div className="d-flex align-items-center">
								<span className="text-dark font-weight-bold">{ this.postCreator.name }</span>
								<span className="text-secondary font-weight-light ml-2">
									<small className="d-inline-block align-top position-relative" style={{ top: 2 }}>
										{ `@${this.postCreator.name.toLowerCase()}` }
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
										{ `${totalVotes || 'No'} vote${totalVotes === 1 ? '' : 's'} ${String.fromCharCode(8226)} ${ pollExpired ? 'Poll ended' : `${pollExpiresDisplay} left`}`}
									</small>
								</span>
							</div> }
						</div>
						<div className="w-100 text-secondary pl-3 my-1" style={{ borderLeft: '1px solid #eee' }}>
							<div className="h6 my-0 py-2 font-weight-normal" style={{ lineHeight: 1.5 }}>{ this.postContent }</div>
							<div>
								{ poll && <Poll user={this.activeUser} voted={userVoted} votes={pollVotes} expires={this.pollExpires} post={post} /> }
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	}

}

export default Post;
