import React from 'react';
import { 
	sendDeviceType, 
	subscribeToActiveClientList, 
	subscribeToClientConnection, 
	subscribeToClientDisconnection, 
	subscribeToControllingUserResponse,

	subscribeToOrientation, 
	sendOrientation 
} from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';

import Welcome from './welcome.js';
import Controller from './controller.js';

import phoneScreen from './images/phoneScreen.png';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			string: '',
			oldRotation: {
				x: 0,
				y: 0,
				z: 0
			},
			rotationDegrees: { 
				x: 0, 
				y: 0, 
				z: 0 
			},
			activeClientList: {},
			inControl: false
		}

		this.rotation = null;
		this.autoRotating = false;
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

		subscribeToActiveClientList((err, activeClientList) => {
			console.log("CLIENT LIST");
			console.log(activeClientList);
			this.setState({
				activeClientList: activeClientList
			})
		});

		subscribeToControllingUserResponse((err, response) => {
			if (response) {
				this.setState({
					inControl: true
				});
				console.log("you are the controlling user");
			} else {
				this.setState({
					inControl: false
				});
				console.log("you are not the controlling user");

			}
		});

		subscribeToOrientation((err, orientation) => {
			const oldX = this.state.rotationDegrees.x;
			const oldY = this.state.rotationDegrees.y;
			const oldZ = this.state.rotationDegrees.z;

			this.setState({
				string : "X: "+ orientation.x + ", Y: " + orientation.y + ", Z: " + orientation.z,
				oldRotation: {
					x : oldX,
					y : oldY,
					z : oldZ
				},
				rotationDegrees : {
					x : orientation.x,
					y : orientation.y,
					z : orientation.z
				}
			});
		});

		this.cameraPosition = new THREE.Vector3(0,30,160);
		this.cameraRotation = new THREE.Euler(this.degreeToRadian(0),this.degreeToRadian(0),this.degreeToRadian(0));

		this.lightPosition = new THREE.Vector3(20, 20, 0);
		this.lightTarget = new THREE.Vector3(0, 0, 0);
	}

	componentDidMount() {
		if(window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", this.orientationChange);
		}

		// RIGHT EDGE -GREEN
		this.refs.phone.faces[ 0 ].color.setHex( 0x10ff00 );
		this.refs.phone.faces[ 1 ].color.setHex( 0x10ff00 );

		// LEFT EDGE - YELLOW
		this.refs.phone.faces[ 2 ].color.setHex( 0xffff00 );
		this.refs.phone.faces[ 3 ].color.setHex( 0xffff00 );

		// BACK EDGE - ORANGE
		this.refs.phone.faces[ 4 ].color.setHex( 0xdf9000 );
		this.refs.phone.faces[ 5 ].color.setHex( 0xdf9000 );

		// FRONT EDGE - RED
		this.refs.phone.faces[ 6 ].color.setHex( 0xff0000 );
		this.refs.phone.faces[ 7 ].color.setHex( 0xff0000 );

		// TOP - BLUE
		this.refs.phone.faces[ 8 ].color.setHex( 0x120196 );
		this.refs.phone.faces[ 9 ].color.setHex( 0x120196 );

		// BOTTOM - PURPLE
		this.refs.phone.faces[ 10 ].color.setHex( 0x860079 );
		this.refs.phone.faces[ 11 ].color.setHex( 0x860079 );


		// TESTING PURPOSES ONLY
		// this.setState({
		// 	inControl: true
		// })
	}

	componentWillUnmount() {
		window.removeEventListener("deviceorientation", this.orientationChange);
	}

	orientationChange(event) {
		if (event.alpha && event.beta && event.gamma) {
			const x = event.beta.toFixed(0);
			const y = event.gamma.toFixed(0);
			const z = event.alpha.toFixed(0);

			sendOrientation({ 
				x: x,
				y: y,
				z: z
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

		let color = new THREE.Color(0xffffff);

		// Calculate Rotation

		// dot product
		if (!this.autoRotating) {
			const dot = this.state.oldRotation.x * this.state.rotationDegrees.x
				+ this.state.oldRotation.y * this.state.rotationDegrees.y
				+ this.state.oldRotation.z * this.state.rotationDegrees.z;

			const lengthOld = Math.sqrt(Math.pow(this.state.oldRotation.x, 2) 
										+ Math.pow(this.state.oldRotation.y, 2)
										+ Math.pow(this.state.oldRotation.z, 2));

			const lengthNew = Math.sqrt(Math.pow(this.state.rotationDegrees.x, 2) 
										+ Math.pow(this.state.rotationDegrees.y, 2)
										+ Math.pow(this.state.rotationDegrees.z, 2));

			const angle = Math.acos(dot / (lengthOld*lengthNew));
			
			if (angle > 10) {
				this.autoRotating = true;

				let tempX;
				let tempY;
				let tempZ;

				if (this.state.rotationDegrees.x - this.state.oldRotation.x > 0) {
					tempX = this.state.oldRotation.x + 1;
				} else if (this.state.rotationDegrees.x - this.state.oldRotation.x < 0) {
					tempX = this.state.oldRotation.x - 1;
				} else {
					tempX = this.state.rotationDegrees.x;
				}

				if (this.state.rotationDegrees.y - this.state.oldRotation.y > 0) {
					tempY = this.state.oldRotation.y + 1;
				} else if (this.state.rotationDegrees.y - this.state.oldRotation.y < 0) {
					tempY = this.state.oldRotation.y - 1;
				} else {
					tempY = this.state.rotationDegrees.y;
				}

				if (this.state.rotationDegrees.z - this.state.oldRotation.z > 0) {
					tempZ = this.state.oldRotation.z + 1;
				} else if (this.state.rotationDegrees.z - this.state.oldRotation.z < 0) {
					tempZ = this.state.oldRotation.z - 1;
				} else {
					tempZ = this.state.rotationDegrees.z;
				}

				this.setState({
					rotationDegrees: {
						x: tempX,
						y: tempY,
						z: tempZ,
					}
				});
			} else {
				const xRadians = this.degreeToRadian(this.state.rotationDegrees.x - 90);
				const yRadians = this.degreeToRadian(this.state.rotationDegrees.y);
				const zRadians = this.degreeToRadian(this.state.rotationDegrees.z);

				this.rotation = new THREE.Euler(xRadians, yRadians, zRadians);
			}
		} else {
			let tempX;
			let tempY;
			let tempZ;
			let checkX = false;
			let checkY = false;
			let checkZ = false;

			if (this.state.rotationDegrees.x - this.state.oldRotation.x > 0) {
				tempX = this.state.oldRotation.x + 1;
			} else if (this.state.rotationDegrees.x - this.state.oldRotation.x < 0) {
				tempX = this.state.oldRotation.x - 1;
			} else {
				tempX = this.state.rotationDegrees.x;
				checkX = true;
			}

			if (this.state.rotationDegrees.y - this.state.oldRotation.y > 0) {
				tempY = this.state.oldRotation.y + 1;
			} else if (this.state.rotationDegrees.y - this.state.oldRotation.y < 0) {
				tempY = this.state.oldRotation.y - 1;
			} else {
				tempY = this.state.rotationDegrees.y;
				checkY = true;
			}

			if (this.state.rotationDegrees.z - this.state.oldRotation.z > 0) {
				tempZ = this.state.oldRotation.z + 1;
			} else if (this.state.rotationDegrees.z - this.state.oldRotation.z < 0) {
				tempZ = this.state.oldRotation.z - 1;
			} else {
				tempZ = this.state.rotationDegrees.z;
				checkZ = true;
			}

			this.setState({
				rotationDegrees: {
					x: tempX,
					y: tempY,
					z: tempZ,
				}
			});

			if (checkX && checkY && checkZ) {
				this.autoRotating = false;
			}
		}

		let welcomeVisible = !this.state.activeClientList.controller;

		return (
			<div className="app">
				<Welcome visible={welcomeVisible} />

				{ !this.state.inControl ? 
					<div className="main-canvas">
						<div className="orientation">{this.state.string}</div>
						<div className="auto-rotating">{"Autorotating: " + this.autoRotating}</div>
						<React3 key={1} antialias={true} mainCamera="camera" width={size} height={size} alpha={true} onAnimate={() => this.onAnimate()}>
							<scene>
								<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} rotation={this.cameraRotation}/>
								<mesh rotation={this.rotation}>
									<boxGeometry ref="phone" width={width} height={height} depth={depth}
										widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
									<meshLambertMaterial wireframe={wireframe} color={color} vertexColors={THREE.VertexColors}>
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

					:

					/*<Controller rotation={this.state.rotationDegrees} />*/
					<Controller rotation={this.state.rotationDegrees} />
				}

			</div>
		);
	}
}

export default App;
