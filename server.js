const _ = require('lodash');
const next = require('next');
const uuid = require('uuid');
const logger = require('morgan');
const moment = require('moment');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();

// Ensure that your pusher credentials are properly set in the .env file
// Using the specified variables
const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_APP_KEY,
	secret: process.env.PUSHER_APP_SECRET,
	cluster: process.env.PUSHER_APP_CLUSTER,
	encrypted: true
});

app.prepare()
	.then(() => {

		const server = express();

		const __AVATARS__ = [
			'https://i.imgur.com/IJOOGRW.png',
			'https://i.imgur.com/R1UcN2u.png',
			'https://i.imgur.com/q1iKHx9.png',
			'https://i.imgur.com/cWIySBG.png',
			'https://i.imgur.com/sheXC6x.png',
			'https://i.imgur.com/oq0ZAdw.png',
			'https://i.imgur.com/3pCgbMI.png',
			'https://i.imgur.com/DX7Jzuu.png',
			'https://i.imgur.com/Pn0IqpB.png',
			'https://i.imgur.com/dsld01L.png',
			'https://i.imgur.com/uTojCvX.png',
			'https://i.imgur.com/4pkuNL6.png',
			'https://i.imgur.com/hktwxP1.png',
			'https://i.imgur.com/7cSADkB.png',
			'https://i.imgur.com/2QgfsTg.png'
		];

		const __USERS__ = (() => {
			const avatars = _.shuffle(__AVATARS__);

			const people = [
				'Stephanie', 'John', 'Steve', 'Anna', 'Margaret', 'Felix', 'Chris', 'Jamie',
				'Rose', 'Bob', 'Vanessa', '9lad', 'Bridget', 'Sebastian', 'Richard'
			];

			return people.map((name, index) => ({ name, id: uuid.v4(), avatar: avatars[index] }));
		})();

		let __POSTS__ = [];

		const finder = (value, field = 'id') => item => item[field] === value;

		const getPostById = id => __POSTS__.find(finder(id));
		const getUserById = id => __USERS__.find(finder(id));

		const getPostIndexById = id => __POSTS__.findIndex(finder(id));
		const getUserIndexById = id => __USERS__.findIndex(finder(id));

		server.use(logger('dev'));
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: true }));

		server.get('/api/users', (req, res) => {
			return res.json({ status: 'success', count: __USERS__.length, users: __USERS__ });
		});

		server.get('/api/posts', (req, res) => {
			return res.json({ status: 'success', count: __POSTS__.length, posts: __POSTS__ });
		});

		server.post('/api/posts', (req, res) => {
			const { post, creator, poll = false, duration = null, choices = null } = req.body;

			if (!( creator && getUserById(creator) )) {
				return res.status(422).json({ status: 'failed', message: 'Cannot resolve post creator.' });
			}

			if (!( post && _.isString(post) )) {
				return res.status(422).json({ status: 'failed', message: 'No post content.' });
			}

			const hasDuration = duration && _.isNumber(duration);
			const hasChoices = choices && _.isArray(choices) && choices.length >= 2;

			if (poll && !( hasDuration && hasChoices )) {
				return res.status(422).json({ status: 'failed', message: 'Invalid poll content.' });
			}

			const newPost = {
				id: uuid.v4(),
				created: moment().unix(),
				votes: poll ? [] : null,
				post, poll, duration, choices, creator
			};

			__POSTS__.push(newPost);

			pusher.trigger('twitter-poll-app', 'new-post', { post: newPost });

			return res.json({ status: 'success', post: newPost });
		});

		server.post('/api/posts/:postid/vote', (req, res) => {
			const { postid } = req.params;
			const { user, choice } = req.body;

			const _user = getUserById(user);
			const postIndex = getPostIndexById(postid);

			if (!(postid && postIndex >= 0)) {
				return res.status(422).json({ status: 'failed', message: 'Cannot resolve post.' });
			}

			const post = __POSTS__[postIndex];

			if (post.poll) {
				const { duration, created } = post;
				const expires = moment(created, 'X').add(duration, 'm');

				if (expires.isBefore()) {
					return res.status(403).json({ status: 'failed', message: 'Poll duration already expired.' });
				}
			} else {
				return res.status(403).json({ status: 'failed', message: 'Post is not a poll.' });
			}

			if (!(user && _user)) {
				return res.status(422).json({ status: 'failed', message: 'Cannot resolve user.' });
			}

			if (post.votes.findIndex(finder(user, 'user')) >= 0) {
				return res.status(403).json({ status: 'failed', message: 'User already voted.' });
			}

			if (!( _.isNumber(choice) && choice >= 0 && choice < post.choices.length )) {
				return res.status(422).json({ status: 'failed', message: 'Invalid post choice.' });
			}

			post.votes.push({ user, choice });

			__POSTS__ = [
				...(__POSTS__.slice(0, postIndex)),
				post,
				...(__POSTS__.slice(postIndex + 1))
			];

			pusher.trigger('twitter-poll-app', 'new-vote', { posts: __POSTS__ });

			return res.json({ status: 'success', post, votes: post.votes.length });
		});

		server.get('*', (req, res) => {
			return handler(req, res);
		});

		server.use((req, res) => {
			return res.status(404).json({ status: 'failed', message: 'Requested resource not found.' });
		});

		server.listen(port, err => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`);
		});

	})
	.catch(ex => {
		console.error(ex.stack);
		process.exit(1);
	});
