import React from 'react';

import qrCode from './images/qr-code.jpg';

import './welcome.css';

class Welcome extends React.Component {

	render() {
		let welcomeContainerClass = "welcome-container";

		if (false) {
		// if (this.props.visible) {
			welcomeContainerClass += " show";
		}

		return (
			<div className={welcomeContainerClass}>
				<div className="instructions">Please connect an iOS device</div>
				<img className="qr-code" src={qrCode} alt="" />
			</div>
		);
	}
}

export default Welcome;
