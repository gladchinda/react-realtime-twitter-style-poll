import '../styles/_global.scss';
import Router from 'next/router';
import React, { Component } from 'react';
import * as Session from '../helpers/session';
import NewPost from '../components/NewPost';

class NewPostPage extends Component {

	state = { user: null }

	componentDidMount() {
		const user = Session.getActiveUser();
		if (!user) return Router.replace('/');

		this.setState({ user });
	}

	render() {
		return this.state.user && <NewPost user={this.state.user} />
	}

}

export default () => (
	<div className="container-fluid position-absolute h-100">
		<NewPostPage />
	</div>
);
