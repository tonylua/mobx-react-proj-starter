import React from 'react';
import { isArray } from 'lodash';
import { exists } from 'dotty';
import { Link } from 'react-router-dom';

const NotFound = ({history, location})=>(
	<div>
		{
			location && exists(location, 'state.message') 
				? location.state.message
				: `404 - ${location.pathname}`
		}
		<br/>
		<ul>
			<li><Link to="/" onClick={e=>history.goBack()}>back to last page</Link></li>
			<li><Link replace={true} to="/">back to main</Link></li>
		{
			(location 
				&& exists(location, 'state.response.result.buttons') 
				&& isArray(location.state.response.result.buttons))
					? location.state.response.result.buttons.map((btn, idx)=>(
						<li key={`${location.key}_${idx}`}><Link replace={true} to={btn.route} className={btn.style}>{btn.label}</Link></li>
					))
					: null
		}
		</ul>
	</div>
);

export default NotFound;