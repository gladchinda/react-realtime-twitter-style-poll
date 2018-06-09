import axios from 'axios';
import Link from 'next/link';
import Pusher from 'pusher-js';
import React, { Component, Fragment } from 'react';
import Layout from '../components/Layout';
import ChoosePersona from '../components/ChoosePersona';

const USER_STORAGE_KEY = '__app.user__';

class IndexPage extends Component {

	state = { user: null, people: [], posts: [] }

	personaSelected = user => this.setState({ user }, () => localStorage.setItem(USER_STORAGE_KEY, user))

	componentDidMount() {

		const user = localStorage.getItem(USER_STORAGE_KEY);
		user && this.setState({ user });

		this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
			cluster: process.env.PUSHER_APP_CLUSTER,
			encrypted: true
		});

		this.channel = this.pusher.subscribe('twitter-poll-app');

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
		return <Fragment>
			{ this.state.user

				? <Fragment>
					<h1 className="font-weight-light w-100 text-center mb-3">Realtime Twitter-Style Poll</h1>

					<Link prefetch replace passHref href="/post">
						<button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>New Post</button>
					</Link>
				</Fragment>

				: <ChoosePersona count={5} people={this.state.people} onSelected={this.personaSelected} />
			}
		</Fragment>
	}
}

export default () => (
	<Layout>
		<div className="container-fluid position-absolute h-100">
			<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
				<IndexPage />
			</div>
		</div>
	</Layout>
);
