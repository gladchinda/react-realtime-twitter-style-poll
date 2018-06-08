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

		let __USERS__ = [];
		let __POSTS__ = [];

		server.use(logger('dev'));
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: true }));

		server.get('/api/posts', (req, res) => {
			return res.json({ status: 'success', count: __POSTS__.length, posts: __POSTS__ });
		});

		server.post('/api/posts', (req, res) => {
			const { poll, post, duration, choices, creator } = req.body;

			if (!(creator && _.isString(post))) {
				return res.status(422).json({ status: 'failed', message: 'No post content.' });
			}

			if (!( post && _.isString(post) )) {
				return res.status(422).json({ status: 'failed', message: 'No post content.' });
			}

			const hasDuration = duration && _.isNumber(duration);
			const hasChoices = choices && _.isArray(choices) && choices.length > 2;

			if (!( poll && hasDuration && hasChoices )) {
				return res.status(422).json({ status: 'failed', message: 'Invalid poll content.' });
			}

			const newPost = {
				id: uuid.v4(),
				created: moment().unix(),
				post, poll, duration, choices, creator
			};

			__POSTS__.push(newPost);
			// trigger pusher update

			return res.json({ status: 'success', post: newPost });
		});

		server.get('*', (req, res) => {
			return handler(req, res);
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
