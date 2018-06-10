import axios from 'axios';
import Link from 'next/link';
import Pusher from 'pusher-js';
import React, { Component, Fragment } from 'react';
import * as Session from '../helpers/session';

import Post from '../components/Post';
import Layout from '../components/Layout';
import ChoosePersona from '../components/ChoosePersona';

class IndexPage extends Component {

	state = { user: null, people: [], posts: [] }

	personaSelected = user => this.setState({ user }, () => Session.initializeSession(user))

	componentDidMount() {
		const user = Session.getActiveUser();
		user && this.setState({ user });

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

			axios.get('/api/users').then(({ data }) => {
				const { users: people = [] } = data;
				this.setState({ people });
			});

			axios.get('/api/posts').then(({ data }) => {
				const { posts = [] } = data;
				this.setState({ posts });
			});

		});
	}

	componentWillUnmount() {
		this.pusher.disconnect();
	}

	render() {

		const { user = null, posts, people } = this.state;
		let activeUser = null;

		if (people && user) {
			activeUser = people.find(person => person.id === user);
		}

		return <Fragment>
			{ activeUser

				? ( posts.length > 0

					? <div className="bg-dark d-flex w-100 flex-wrap justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
						<div className="bg-dark position-fixed py-5 d-flex align-items-center justify-content-between" style={{ left: 30, right: 30,  zIndex: 100 }}>
							<Link prefetch replace passHref href="/post">
								<button className="btn btn-info text-uppercase font-weight-bold" style={{ height: 40, borderRadius: 20, fontSize: '0.8rem', lineHeight: 1, width: 120 }}>New Post</button>
							</Link>

							<h1 className="text-white font-weight-light text-center h2">Realtime Poll</h1>

							<div className="d-flex align-items-center">
								<h2 className="mb-0 h5 font-weight-bold text-white mr-3">{activeUser.name}</h2>
								<div className="rounded-circle bg-light d-flex justify-content-center align-items-center" style={{ width: 50, height: 50 }}>
									<img className="rounded img-fluid" src={activeUser.avatar} alt={activeUser.name} title={activeUser.name} />
								</div>
							</div>

						</div>

						<div className="w-100 mt-5 py-5" style={{ maxWidth: 640 }}>
							<div className="mt-5 pt-3">
								{ posts.map((post, index) => {
									return <Post key={index} user={activeUser} people={people} post={post} />
								}) }
							</div>
						</div>
					</div>

					: <Fragment>
							<div className="position-absolute w-100 h-100 px-3 pb-5 d-flex flex-wrap align-items-center align-content-center justify-content-center" style={{ top: 0, bottom: 0 }}>
								<h1 className="font-weight-light w-100 text-center mb-3">Realtime Twitter-Style Poll</h1>

								<Link prefetch replace passHref href="/post">
									<button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>New Post</button>
								</Link>
							</div>
					</Fragment>
				)

				: <ChoosePersona count={5} people={people} onSelected={this.personaSelected} />
			}
		</Fragment>
	}
}

export default () => (
	<Layout>
		<div className="container-fluid px-0">
			<div className="d-flex w-100 flex-wrap justify-content-center align-items-center align-content-center">
				<IndexPage />
			</div>
		</div>
	</Layout>
);
