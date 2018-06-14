import '../styles/_global.scss';
import axios from 'axios';
import Pusher from 'pusher-js';
import React, { Component, Fragment } from 'react';
import * as Session from '../helpers/session';

import Post from '../components/Post';
import Loader from '../components/Loader';
import NewPost from '../components/NewPost';
import ChoosePersona from '../components/ChoosePersona';

class IndexPage extends Component {

	state = { user: null, people: [], posts: [], loading: true, creatingPost: false }

	resolveUserFromSession = () => {
		const user = Session.getActiveUser();
		this.setState({ user: user || null });
	}

	personaSelected = user => this.setState({ user }, () => Session.initializeSession(user))

	createNewPost = () => this.setState({ creatingPost: true })

	terminateNewPost = () => this.setState({ creatingPost: false })

	componentDidMount() {
		this.resolveUserFromSession();

		this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
			cluster: process.env.PUSHER_APP_CLUSTER,
			encrypted: true
		});

		this.channel = this.pusher.subscribe('twitter-poll-app');

		this.channel.bind('new-post', ({ post }) => {
			const posts = [ ...this.state.posts, post ];
			this.setState({ posts });
		});

		this.channel.bind('new-vote', ({ posts }) => this.setState({ posts }));

		this.pusher.connection.bind('connected', () => {

			this.setState({ loading: true });

			Promise.all([
				axios.get('/api/users').then(({ data }) => {
					const { users: people = [] } = data;
					this.setState({ people });
				}),

				axios.get('/api/posts').then(({ data }) => {
					const { posts = [] } = data;
					this.setState({ posts });
				})
			]).then(() => { this.setState({ loading: false }) });

		});
	}

	componentWillUnmount() {
		this.pusher.disconnect();
		this.timer && clearTimeout(this.timer);
	}

	render() {

		let activeUser = null;
		const { user = null, posts, people, loading, creatingPost } = this.state;

		if (people && user) {
			activeUser = people.find(person => person.id === user);
		}

		if (loading) return <Loader />

		if (activeUser && creatingPost) {
			return (
				<div className="container-fluid position-absolute h-100 absolute--full-height">
					<NewPost user={activeUser.id} onTerminatePost={this.terminateNewPost} />
				</div>
			)
		}

		return <Fragment>
			{ activeUser

				? ( posts.length > 0

					? <div className="bg-dark d-flex w-100 flex-wrap justify-content-center align-items-start min-h-100">
						<div className="bg-dark position-fixed py-5 d-flex align-items-center justify-content-between topbar topbar--home">
							<button className="btn btn-info text-uppercase font-weight-bold button--rounded" onClick={this.createNewPost}>New Post</button>

							{/* <h1 className="text-white font-weight-light text-center h2 d-none d-md-block">Realtime Poll</h1> */}

							<div className="d-flex align-items-center">
								<h2 className="mb-0 h5 font-weight-bold text-white mr-3">{activeUser.name}</h2>
								<div className="rounded-circle bg-light d-flex justify-content-center align-items-center avatar avatar--user">
									<img className="rounded-circle img-fluid" src={activeUser.avatar} alt={activeUser.name} title={activeUser.name} />
								</div>
							</div>

						</div>

						<div className="w-100 py-5 max-w-640 posts-container">
							{
								posts.sort((a, b) => {
									a = +a.created;
									b = +b.created;
									return (a > b) ? -1 : (a < b) ? 1 : 0;
								})
								.map((post, index) => {
									return <Post key={index} user={activeUser} people={people} post={post} />
								})
							}
						</div>
					</div>

					: <Fragment>
							<div className="position-absolute w-100 h-100 px-3 pb-5 d-flex flex-wrap align-items-center align-content-center justify-content-center absolute--full-height">
								<h1 className="font-weight-light w-100 text-center mb-3">Realtime Poll</h1>

								<button className="btn btn-info text-uppercase font-weight-bold button--rounded" onClick={this.createNewPost}>New Post</button>
							</div>
					</Fragment>
				)

				: <ChoosePersona count={5} people={people} onSelected={this.personaSelected} />
			}
		</Fragment>
	}
}

export default () => (
	<div className="container-fluid px-0">
		<div className="d-flex w-100 flex-wrap justify-content-center align-items-center align-content-center">
			<IndexPage />
		</div>
	</div>
);
