import React, { Component } from 'react';
import { sendMessage, subscribeToMessages } from './api';

import './App.css';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			messageValue: '',
			string: ''
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.orientationChange = this.orientationChange.bind(this);

		subscribeToMessages((err, message) => {
			this.setState({
				string : message
			});
		});
	}

	componentDidMount() {
		// navigator.getUserMedia = navigator.getUserMedia ||
		//                         navigator.webkitGetUserMedia ||
		//                         navigator.mozGetUserMedia ||
		//                         navigator.msGetUserMedia;

		// if (navigator.mediaDevices.getUserMedia) {

		// navigator.mediaDevices.getUserMedia({audio: true, video: true}, function(stream) {
		//     this.webcamInput = window.URL.createObjectURL(stream);
		// }, () => {
		//     console.log("getUserMedia failed");
		// });

		// } else {
		//     video.src = 'somevideo.webm'; // fallback.
		// }

		window.addEventListener("deviceorientation", this.orientationChange);
		// window.addEventListener("click", this.orientationChange);
	}

	componentWillUnmount() {
		window.removeEventListener("deviceorientation", this.orientationChange);
		// window.removeEventListener("click", this.orientationChange);
	}

	orientationChange(event) {
		sendMessage("Z: "+ event.alpha.toFixed(0) + ", X: " + event.beta.toFixed(0) + ", Y: " + event.gamma.toFixed(0));
	}

	handleChange(event) {
		this.setState({messageValue: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		sendMessage(this.state.messageValue);
		this.setState({messageValue: ""});
	}

	render() {
		return (
			<div className="app">
				<div className="header"></div>
				<input className="text-input" type="text" placeholder="placeholder" value={this.state.messageValue} onChange={this.handleChange} />
				<div className="text-input-submit" onClick={this.handleSubmit}>Send</div>
				<div className="message">{this.state.string}</div>
				{/*<video className="video" ref={(element) => { this.webcamInput = element; }} autoPlay></video>*/}
			</div>
		);
	}
}

export default App;
