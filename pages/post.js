import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import NewPost from '../components/NewPost';

export default () => (
	<Layout>
		<div className="container-fluid position-absolute h-100">

			<div className="position-absolute w-100 bg-white" style={{ left: 20, top: 30, zIndex: 100 }}>
				<Link prefetch href="/" passHref>
					<button className="btn btn-link text-uppercase font-weight-bold ml-3 px-0" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Back to Posts</button>
				</Link>
			</div>

			<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
				<NewPost />
			</div>

		</div>
	</Layout>
);
