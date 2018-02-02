import React from 'react';
import { sendMessage, subscribeToMessages } from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.cameraPosition = new THREE.Vector3(0,-160,160);
		this.cameraRotation = new THREE.Euler(this.degreeToRadian(40),this.degreeToRadian(0),this.degreeToRadian(0));

		this.state = {
			messageValue: '',
			string: '',
			rotationDegrees: { 
				x: 0, 
				y: 0, 
				z: 0 
			}
		}

		this.orientationChange = this.orientationChange.bind(this);

		subscribeToMessages((err, message) => {
			this.setState({
				string : "X: "+ message.x + ", Y: " + message.y + ", Z: " + message.z,
				rotationDegrees : {
					x : message.x,
					y : message.y,
					z : message.z
				}
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
			sendMessage({ 
				x: event.beta.toFixed(0),
				y: event.gamma.toFixed(0),
				z: event.alpha.toFixed(0)
			});
		}
	}

	onAnimate() {

	}

	degreeToRadian(degree) {
		return degree*(Math.PI/180);
	}

	render() {
		// Canvas size
		let size = 400;

		// Box sizing, segments
		let wireframe = true;
		let width = 60;
		let height = 100;
		let depth = 5;

		let widthSegments = 3;
		let heightSegments = 5;
		let depthSegments = 0;

		// Box Rotation
		const xRadians = this.degreeToRadian(this.state.rotationDegrees.x);
		const yRadians = this.degreeToRadian(this.state.rotationDegrees.y);
		const zRadians = this.degreeToRadian(this.state.rotationDegrees.z);

		let rotation;
		rotation = new THREE.Euler(xRadians, yRadians, zRadians);

		return (
			<div className="app">
				<div className="header"></div>
				<div className="message">{this.state.string}</div>
				<React3 key={1} mainCamera="camera" width={size} height={size} alpha={true} onAnimate={() => this.onAnimate()}>
					<scene>
						<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} rotation={this.cameraRotation}/>
						<mesh rotation={rotation}>
							<boxGeometry width={width} height={height} depth={depth}
								widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
							<meshBasicMaterial wireframe={wireframe}>
							</meshBasicMaterial>
						</mesh>
					</scene>
				</React3>
			</div>
		);
	}
}

export default App;
