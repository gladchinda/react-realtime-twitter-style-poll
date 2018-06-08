import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default () => (
	<Layout>
		<div className="container-fluid position-absolute h-100">
			<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
				<h1 className="font-weight-light w-100 text-center">Realtime Twitter-Style Poll</h1>
				<Link prefetch href="/post" passHref>
					<button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>New Post</button>
				</Link>
			</div>
		</div>
	</Layout>
);
