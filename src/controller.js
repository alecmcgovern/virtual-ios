import React from 'react';

import './controller.css';

class Controller extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div ref="background" className="controller-container">
				<p>{this.props.message}</p>
				<br />
			</div>
		);
	}
}

export default Controller;