import React from 'react';
import { 
	sendDeviceType, 
	subscribeToActiveClientList, 
	subscribeToClientConnection, 
	subscribeToClientDisconnection, 
	subscribeToControllingUserConnected,
	subscribeToControllingUserDisconnected,

	subscribeToOrientation, 
	sendOrientation 
} from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Welcome from './welcome.js';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			string: '',
			rotationDegrees: { 
				x: 0, 
				y: 0, 
				z: 0 
			},
			clientList: [],
			controllingClientId: null
		}

		this.orientationChange = this.orientationChange.bind(this);

		subscribeToClientConnection((err, clientId) => {
			console.log(clientId + " has connected");

			let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

			if (iOS) {
				sendDeviceType("iOS");
			}
		});

		subscribeToClientDisconnection((err, clientId) => {
			console.log(clientId + " has disconnected");
		});

		subscribeToActiveClientList((err, clientList) => {
			console.log("CLIENT LIST");
			console.log(clientList);
			this.setState({
				clientList: clientList
			})
		});

		subscribeToControllingUserConnected((err, clientId) => {
			console.log(clientId + " is now controlling the orientation");
			this.setState({
				controllingClientId: clientId
			});
		});

		subscribeToControllingUserDisconnected((err, clientId) => {
			console.log("no one in control orientation");
			this.setState({
				controllingClientId: null
			});
;		});

		subscribeToOrientation((err, orientation) => {
			this.setState({
				string : "X: "+ orientation.x + ", Y: " + orientation.y + ", Z: " + orientation.z,
				rotationDegrees : {
					x : orientation.x,
					y : orientation.y,
					z : orientation.z
				}
			});
		});

		const d = 20;

		this.cameraPosition = new THREE.Vector3(0,30,160);
		this.cameraRotation = new THREE.Euler(this.degreeToRadian(0),this.degreeToRadian(0),this.degreeToRadian(0));

		this.lightPosition = new THREE.Vector3(d, d, 0);
		this.lightTarget = new THREE.Vector3(0, 0, 0);
	}

	componentDidMount() {
		if(window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", this.orientationChange);
		}
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
		let size = 600;

		// Box sizing, segments
		let wireframe = false;
		let width = 60;
		let height = 100;
		let depth = 5;

		let widthSegments = 0;
		let heightSegments = 0;
		let depthSegments = 0;

		let color = new THREE.Color(0x004be6);

		// Box Rotation
		const xRadians = this.degreeToRadian(this.state.rotationDegrees.x - 90);
		const yRadians = this.degreeToRadian(this.state.rotationDegrees.y);
		const zRadians = this.degreeToRadian(this.state.rotationDegrees.z);

		let rotation;
		rotation = new THREE.Euler(xRadians, yRadians, zRadians);


		let welcomeVisible = this.state.controllingClientId;

		return (
			<div className="app">
				<Welcome visible={welcomeVisible} />
				<div className="main-canvas">
					<div className="orientation">{this.state.string}</div>
					<React3 key={1} antialias={true} mainCamera="camera" width={size} height={size} alpha={true} onAnimate={() => this.onAnimate()}>
						<scene>
							<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} rotation={this.cameraRotation}/>
							<mesh rotation={rotation}>
								<boxGeometry ref="phone" width={width} height={height} depth={depth}
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
			</div>
		);
	}
}

export default App;
