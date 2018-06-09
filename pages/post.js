import Link from 'next/link';
import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import * as Session from '../helpers/session';
import Layout from '../components/Layout';
import NewPost from '../components/NewPost';

class NewPostPage extends Component {

	state = { user: null }

	componentDidMount() {
		const user = Session.getActiveUser();
		if (!user) return Router.replace('/');

		this.setState({ user });
	}

	render() {
		return this.state.user && (
			<Fragment>
				<div className="position-absolute bg-white mt-5" style={{ left: 30, right: 0, zIndex: 100 }}>
					<Link prefetch replace passHref href="/">
						<button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Back to Posts</button>
					</Link>
				</div>

				<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
					<NewPost user={this.state.user} />
				</div>
			</Fragment>
		);
	}

}

export default () => (
	<Layout>
		<div className="container-fluid position-absolute h-100">
			<NewPostPage />
		</div>
	</Layout>
);
