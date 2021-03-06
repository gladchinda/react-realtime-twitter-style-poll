import moment from 'moment';
import _range from 'lodash/range';
import React, { Component, Fragment } from 'react';
import Poll from '../components/Poll';

class Post extends Component {

	constructor(props) {
		super(props);

		const { people, post, user } = props;
		const { post: postContent, poll, duration, creator, created } = post;

		this.isPoll = poll;
		this.activeUser = user;
		this.postCreator = people.find(person => person.id === creator);

		this.postContent = postContent;
		this.postCreated = moment(created, 'X');
		this.pollExpires = poll ? this.postCreated.clone().add(duration, 'm') : null;

		this.state = { postCreatedDisplay: null, pollExpiresDisplay: null, pollExpired: false };
	}

	getVotesData = () => {
		const { post } = this.props;
		const { votes, choices } = post;

		let userVoted = false;
		let pollVotes = null;
		let totalVotes = 0;
		let votedChoice = null;

		if (this.isPoll) {
			const voteCounts = votes.reduce((stat, vote) => {
				const { choice } = vote;
				stat[choice] ? (stat[choice] += 1) : (stat[choice] = 1);
				return stat;
			}, []);

			const userIndex = votes.findIndex(vote => vote.user === this.activeUser.id);

			if (userIndex >= 0) {
				userVoted = true;
				votedChoice = votes[userIndex].choice;
			}

			pollVotes = _range(0, choices.length).map(choice => ({
				choice: choices[choice],
				count: voteCounts[choice] || 0
			}));

			totalVotes = pollVotes.map(vote => vote.count).reduce((sum, count) => sum + count, 0);
		}

		return { userVoted, pollVotes, totalVotes, votedChoice };
	}

	getPollLifetimeData = () => {
		const now = moment();
		let data = { pollExpired: false, pollExpiresDisplay: null, expires: null };

		if (this.isPoll) {
			const expiresMin = Math.max(0, this.pollExpires.diff(now, 'm'));
			const expiresSec = Math.max(0, this.pollExpires.diff(now, 's'));

			const pollExpired = this.pollExpires.isBefore();
			const pollExpiresDisplay = (expiresSec < 60) ? `${expiresSec}s` : `${expiresMin}m`;

			data = { ...data, pollExpired, pollExpiresDisplay, expires: expiresSec };
		}

		return data;
	}

	updatePostTimers = () => {
		const now = moment();
		const { expires, pollExpired, pollExpiresDisplay } = this.getPollLifetimeData();

		this.pollTimer && (expires === 0) && clearInterval(this.pollTimer);

		const activatePollTimer = !this.pollTimer && (expires / 60 <= 2);

		activatePollTimer	&& setTimeout(() => this.pollTimer = setInterval(() => {
			const { pollExpired, pollExpiresDisplay } = this.getPollLifetimeData();
			this.setState({ pollExpired, pollExpiresDisplay });
		}, 1000), Math.max(1, expires - 60) * 1000);

		const useHourlyTimer = Math.floor(now.diff(this.postCreated) / 1000) > (60 * 60);
		const showDateInstead = now.diff(this.postCreated, 'd') >= 2;

		const postCreatedDisplay = showDateInstead
			? this.postCreated.format('MMM D')
			: this.postCreated.fromNow(true)
				.replace('a few seconds', 'just now')
				.replace(/^an?/, '1')
				.replace(/^(\d+) (.).+$/, `$1$2 ago`)
				.replace('1d ago', 'yesterday');

		const data = { postCreatedDisplay, pollExpired, pollExpiresDisplay };

		!(pollExpired && showDateInstead) && this.setState(data, () => {
			this.timer = setTimeout(this.updatePostTimers, (useHourlyTimer ? 60 : 1) * 60 * 1000);
		});
	}

	resetTimers = () => {
		this.timer && clearTimeout(this.timer);
		this.pollTimer && clearInterval(this.pollTimer);
	}

	componentDidMount() {
		this.updatePostTimers();
	}

	componentWillUnmount() {
		this.resetTimers();
	}

	renderPostCreatorAvatar = () => {
		const { name: creator, avatar } = this.postCreator;

		return (
			<div className="rounded-circle bg-light d-flex justify-content-center align-items-center avatar avatar--post">
				<img className="rounded-circle img-fluid" src={avatar} alt={creator} title={creator} />
			</div>
		)
	}

	renderPostHeader = () => {
		const { name: creator } = this.postCreator;
		const { totalVotes } = this.getVotesData();
		const { postCreatedDisplay, pollExpiresDisplay, pollExpired } = this.state;

		const DOT_SEPARATOR = String.fromCharCode(8226);

		const VOTES_DISPLAY = `${totalVotes || 'No'} vote${totalVotes === 1 ? '' : 's'}`;
		const EXPIRES_DISPLAY = `${pollExpired ? 'Poll ended' : `${pollExpiresDisplay} left`}`;

		return (
			<div className="w-100 my-2 h6 d-flex justify-content-between align-items-center">

				<div className="d-flex align-items-center">
					<span className="text-dark font-weight-bold">{creator}</span>
					<span className="d-inline-block text-secondary text--small font-weight-normal ml-2">
						{`@${creator.toLowerCase()} ${DOT_SEPARATOR} ${postCreatedDisplay}`}
					</span>
				</div>

				{ this.isPoll && (
					<span className="d-flex align-items-center text-secondary text--small font-weight-normal ml-1 mr-3">
						{`${VOTES_DISPLAY} ${DOT_SEPARATOR} ${EXPIRES_DISPLAY}`}
					</span>
				) }

			</div>
		)
	}

	render() {

		if (!(this.activeUser || this.postCreator)) return null;

		const { post } = this.props;
		const { userVoted, votedChoice, pollVotes } = this.getVotesData();

		return (
			<div className="bg-white rounded border border-gray w-100 position-relative p-3 mb-4">
				<div className="w-100 d-flex align-items-start justify-content-between">

					{ this.renderPostCreatorAvatar() }

					<div className="d-flex flex-wrap align-items-start align-content-start pl-3 post-item">

						{ this.renderPostHeader() }

						<div className="w-100 text-secondary pl-3 my-1 post-item__post-content">

							<div className="h6 w-100 my-0 py-2 font-weight-normal post-item__post-text">{ this.postContent }</div>

							{ this.isPoll && <Poll user={this.activeUser} post={post} voted={userVoted} votedChoice={votedChoice} votes={pollVotes} expires={this.pollExpires} /> }

						</div>

					</div>

				</div>
			</div>
		)
	}

}

export default Post;
