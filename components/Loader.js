import React from 'react';

const Loader = props => {
	const { small, light } = props;

	const loaderClass = [
		'loader position-absolute w-100 h-100 d-flex justify-content-center align-items-center',
		small ? 'loader--small' : '',
		light ? 'loader--light' : ''
	].join(' ').trim().replace(/\s+/g, ' ');

	return <div className={loaderClass}>
		<span className="loader__ball loader__ball--1 d-inline-block mx-1" />
		<span className="loader__ball loader__ball--2 d-inline-block mx-1" />
		<span className="loader__ball loader__ball--3 d-inline-block mx-1" />
	</div>
}

export default Loader;
