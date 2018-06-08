import React from 'react';
import Layout from '../components/Layout';
import NewPost from '../components/NewPost';

export default () => (
	<Layout>
		<div className="container-fluid position-absolute h-100">
			<div className="d-flex position-relative h-100 w-50 mx-auto flex-wrap justify-content-center align-items-center align-content-center">
				{/* <h1 className="font-weight-light">Realtime Twitter-Style Poll</h1> */}
				<NewPost />
			</div>
		</div>
	</Layout>
);
