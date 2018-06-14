import moment from 'moment';

export const USER_STORAGE_KEY = '__app.user__';
export const USER_SESSION_KEY = '__app.expires__';
export const USER_SESSION_DURATION_SECONDS = 60 * 15; // 15 mins

export const initializeSession = user => {
	const expires = `${moment().add(USER_SESSION_DURATION_SECONDS, 's').format('x')}`;

	sessionStorage.setItem(USER_STORAGE_KEY, user);
	sessionStorage.setItem(USER_SESSION_KEY, expires);
}

export const destroySession = () => {
	sessionStorage.clear();
}

export const verifySessionActive = () => {
	const session = sessionStorage.getItem(USER_SESSION_KEY);
	const expired = moment(+session).isBefore();

	expired && destroySession();
}

export const getActiveUser = () => {
	verifySessionActive();
	return sessionStorage.getItem(USER_STORAGE_KEY);
}
