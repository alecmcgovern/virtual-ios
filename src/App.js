import React from 'react';
import { sendMessage, subscribeToMessages } from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.cameraPosition = new THREE.Vector3(0,0,200);

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
		window.addEventListener("deviceorientation", this.orientationChange);
	}

	componentWillUnmount() {
		window.removeEventListener("deviceorientation", this.orientationChange);
	}

	orientationChange(event) {
		if (event.alpha && event.beta && event.gamma) {
			sendMessage("Z: "+ event.alpha.toFixed(0) + ", X: " + event.beta.toFixed(0) + ", Y: " + event.gamma.toFixed(0));
		}
	}

	handleChange(event) {
		this.setState({messageValue: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		sendMessage(this.state.messageValue);
		this.setState({messageValue: ""});
	}

	onAnimate() {

	}

	degreeToRadian(degree) {
		return degree*(Math.PI/180);
	}

	render() {
		let rotation;
		let divisions = 36;
		let wireframe = true;
		let size = 400;

		let width = 100;
		let height = 100;
		let depth = 10;

		let widthSegments = 10;
		let heightSegments = 10;
		let depthSegments = 2;

		const yRadians = this.degreeToRadian(0);
		const zRadians = this.degreeToRadian(0);
		const xRadians = this.degreeToRadian(0);

		rotation = new THREE.Euler(xRadians, yRadians, zRadians);

		return (
			<div className="app">
				<div className="header"></div>
				{/*<input className="text-input" type="text" placeholder="placeholder" value={this.state.messageValue} onChange={this.handleChange} />
				<div className="text-input-submit" onClick={this.handleSubmit}>Send</div>*/}
				<div className="message">{this.state.string}</div>
				<React3 key={1} mainCamera="camera" width={size} height={size} alpha={true} onAnimate={() => this.onAnimate()}>
					<scene>
						<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} />
						<mesh rotation={rotation}>
							{/*<sphereGeometry radius={2.1} 
											widthSegments={divisions} 
											heightSegments={divisions} />*/}
							<boxGeometry width={width} height={height} depth={depth}
								widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
							<meshBasicMaterial wireframe={wireframe}>
							</meshBasicMaterial>
						</mesh>
					</scene>
				</React3>
				{/*<video className="video" ref={(element) => { this.webcamInput = element; }} autoPlay></video>*/}
			</div>
		);
	}
}

export default App;
