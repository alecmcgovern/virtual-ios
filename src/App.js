import React from 'react';
import { subscribeToActiveClientList, subscribeToClientConnection, subscribeToClientDisconnection, sendOrientation, subscribeToOrientation } from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

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

		subscribeToClientConnection((err, clientId) => {
			console.log(clientId + " has connected");
		});

		subscribeToClientDisconnection((err, clientId) => {
			console.log(clientId + " has disconnected");
		});

		subscribeToActiveClientList((err, clientList) => {
			console.log("============");
			console.log("CLIENT LIST");
			console.log(clientList);
			console.log("============");
		});

		subscribeToOrientation((err, message) => {
			this.setState({
				string : "X: "+ message.x + ", Y: " + message.y + ", Z: " + message.z,
				rotationDegrees : {
					x : message.x,
					y : message.y,
					z : message.z
				}
			});
		});

		const d = 20;

		this.cameraPosition = new THREE.Vector3(0,-160,160);
		this.cameraRotation = new THREE.Euler(this.degreeToRadian(40),this.degreeToRadian(0),this.degreeToRadian(0));

		this.lightPosition = new THREE.Vector3(d, d, d);
		this.lightTarget = new THREE.Vector3(0, 0, 0);
	}

	componentDidMount() {
		window.addEventListener("deviceorientation", this.orientationChange);
	}

	componentWillUnmount() {
		window.removeEventListener("deviceorientation", this.orientationChange);
	}

	orientationChange(event) {
		if (event.alpha && event.beta && event.gamma) {
			sendOrientation({ 
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
		const d = 20;

		// Canvas size
		let size = 400;

		// Box sizing, segments
		let wireframe = false;
		let width = 60;
		let height = 100;
		let depth = 5;

		let widthSegments = 3;
		let heightSegments = 5;
		let depthSegments = 0;

		let color = new THREE.Color(0x004be6);

		// Box Rotation
		const xRadians = this.degreeToRadian(this.state.rotationDegrees.x);
		const yRadians = this.degreeToRadian(this.state.rotationDegrees.y);
		const zRadians = this.degreeToRadian(this.state.rotationDegrees.z);

		let rotation;
		rotation = new THREE.Euler(xRadians, yRadians, zRadians);

		return (
			<div className="app">
				<div className="header"></div>
				<div className="orientation">{this.state.string}</div>
				<React3 key={1} antialias={true} mainCamera="camera" width={size} height={size} alpha={true} onAnimate={() => this.onAnimate()}>
					<scene>
						<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} rotation={this.cameraRotation}/>
						<mesh rotation={rotation}>
							<boxGeometry width={width} height={height} depth={depth}
								widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
							<meshLambertMaterial wireframe={wireframe} color={color}>
							</meshLambertMaterial>
						</mesh>
						<object3D>
							<ambientLight/>
						</object3D>
						<directionalLight
							color={0xffffff}
							intensity={1.75}
							castShadow
							shadowMapWidth={1024}
							shadowMapHeight={1024}
							shadowCameraLeft={-d}
							shadowCameraRight={d}
							shadowCameraTop={d}
							shadowCameraBottom={-d}

							shadowCameraFar={3 * d}
							shadowCameraNear={d}

							position={this.lightPosition}
							lookAt={this.lightTarget} />
					</scene>
				</React3>
			</div>
		);
	}
}

export default App;
