import moment from 'moment';

const USER_STORAGE_KEY = '__app.user__';
const USER_SESSION_KEY = '__app.expires__';
const USER_SESSION_DURATION_SECONDS = 60 * 15; // 15mins

export const initializeSession = user => {
	const expires = moment().add(USER_SESSION_DURATION_SECONDS, 's').format('X');

	localStorage.setItem(USER_STORAGE_KEY, user);
	localStorage.setItem(USER_SESSION_KEY, expires);
}

export const destroySession = () => {
	localStorage.clear();
}

export const verifySessionActive = () => {
	const session = localStorage.getItem(USER_SESSION_KEY);
	const expired = moment(session).isBefore();

	expired && destroySession();
}

export const getActiveUser = () => {
	verifySessionActive();
	return localStorage.getItem(USER_STORAGE_KEY);
}
