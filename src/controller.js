import React from 'react';

import './controller.css';

class Controller extends React.Component {
	constructor(props) {
		super(props);

		const red = this.calculateRed();
		const green = this.calculateGreen();
		const blue = 0;

		this.state = {
			backgroundColor: "rgb(" + red + "," + green + "," + blue + ")" 
		}
	}

	calculateRed() {
		const xOffset = Math.abs(this.props.rotation.x / 180);
		const yOffset = Math.abs(this.props.rotation.y / 90);

		const totalOffsetPercent = (xOffset/2 + yOffset/2);

		if (totalOffsetPercent > 0.5) {
			return 256;
		} else {
			let red = totalOffsetPercent*2*256;
			return red.toFixed(0);
		}
	}

	calculateGreen() {
		const xOffset = Math.abs(this.props.rotation.x / 180);
		const yOffset = Math.abs(this.props.rotation.y / 90);

		const totalOffsetPercent = (xOffset/2 + yOffset/2);

		if (totalOffsetPercent < 0.5) {
			return 256;
		} else {
			let green = (1 - totalOffsetPercent*2) * 256;
			return green.toFixed(0);
		}
	}

	componentDidUpdate() {
		const red = this.calculateRed();
		const green = this.calculateGreen();
		const blue = 0;

		this.setState({
			backgroundColor: "rgb(" + red + "," + green + "," + blue + ")" 
		});
	}

	render() {
		return (
			<div ref="background" className="controller-container" style={{backgroundColor:this.state.backgroundColor}}>
				<p>You are in control</p>
				<br />
				<p>Hold phone flat to start</p>
				<br />
				<p>{"X: " + this.props.rotation.x}</p>
				<p>{"Y: " + this.props.rotation.y}</p>
				<p>{"Z: " + this.props.rotation.z}</p>
			</div>
		);
	}
}

export default Controller;