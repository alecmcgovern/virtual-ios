import React from 'react';
import { 
	sendDeviceType, 
	subscribeToActiveClientList, 
	subscribeToClientConnection, 
	subscribeToClientDisconnection, 
	subscribeToControllingUserResponse,

	subscribeToOrientation, 
	subscribeToTargetOrientation, 
	sendOrientation,
	sendTargetOrientation
} from './api';

import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CANNON from 'cannon/src/Cannon';

import Welcome from './welcome.js';
import Controller from './controller.js';

import phoneScreen from './images/phoneScreen.png';

import './App.css';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			rotationDegrees: { 
				x: 0, 
				y: 0, 
				z: 0 
			},
			targetDegrees: {
				x: 0,
				y: 0,
				z: 0
			},
			activeClientList: {},
			inControl: false,
			gameStarted: false
		}

		this.rotation = null;
		this.randomRotation = null;
		this.timeout = null;
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
			});

			if (!activeClientList.controller) {
				this.setState({
					gameStarted: false
				})
			}
		});

		subscribeToControllingUserResponse((err, response) => {
			if (!this.state.inControl) {
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
			}
		});

		subscribeToOrientation((err, orientation) => {
			window.requestAnimationFrame(() => {
				this.setState({
					rotationDegrees : {
						x : orientation.x,
						y : orientation.y,
						z : orientation.z
					}
				});
			});
		});

		subscribeToTargetOrientation((err, orientation) => {
			this.setState({
				gameStarted: true,
				targetDegrees : {
					x : orientation.x,
					y : orientation.y,
					z : orientation.z
				}
			});
		});

		this.cameraPosition = new THREE.Vector3(0,30,160);
		this.cameraRotation = new THREE.Euler(THREE.Math.degToRad(0),THREE.Math.degToRad(0),THREE.Math.degToRad(0));

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
		this.refs.angle.faces[ 0 ].color.setHex( 0x10ff00 );
		this.refs.angle.faces[ 1 ].color.setHex( 0x10ff00 );

		// LEFT EDGE - YELLOW
		this.refs.phone.faces[ 2 ].color.setHex( 0xffff00 );
		this.refs.phone.faces[ 3 ].color.setHex( 0xffff00 );
		this.refs.angle.faces[ 2 ].color.setHex( 0xffff00 );
		this.refs.angle.faces[ 3 ].color.setHex( 0xffff00 );

		// BACK EDGE - ORANGE
		this.refs.phone.faces[ 4 ].color.setHex( 0xdf9000 );
		this.refs.phone.faces[ 5 ].color.setHex( 0xdf9000 );
		this.refs.angle.faces[ 4 ].color.setHex( 0xdf9000 );
		this.refs.angle.faces[ 5 ].color.setHex( 0xdf9000 );

		// FRONT EDGE - RED
		this.refs.phone.faces[ 6 ].color.setHex( 0xff0000 );
		this.refs.phone.faces[ 7 ].color.setHex( 0xff0000 );
		this.refs.angle.faces[ 6 ].color.setHex( 0xff0000 );
		this.refs.angle.faces[ 7 ].color.setHex( 0xff0000 );

		// TOP - BLUE
		this.refs.phone.faces[ 8 ].color.setHex( 0x120196 );
		this.refs.phone.faces[ 9 ].color.setHex( 0x120196 );
		this.refs.angle.faces[ 8 ].color.setHex( 0x120196 );
		this.refs.angle.faces[ 9 ].color.setHex( 0x120196 );

		// BOTTOM - PURPLE
		this.refs.phone.faces[ 10 ].color.setHex( 0x860079 );
		this.refs.phone.faces[ 11 ].color.setHex( 0x860079 );
		this.refs.angle.faces[ 10 ].color.setHex( 0x860079 );
		this.refs.angle.faces[ 11 ].color.setHex( 0x860079 );

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

	watchForStartGame() {
		if (Math.abs(this.state.rotationDegrees.x) < 5 && Math.abs(this.state.rotationDegrees.y) < 5) {
			if (!this.timeout) {
				this.timeout = setTimeout(() => {
					this.setRandomAngle();
				}, 3000);
			}
		} else {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	watchForAngleAlignment() {
		if (Math.abs(Math.abs(this.state.rotationDegrees.x) - Math.abs(this.state.targetDegrees.x)) < 10
			&& Math.abs(Math.abs(this.state.rotationDegrees.y) - Math.abs(this.state.targetDegrees.y)) < 10
			&& Math.abs(Math.abs(this.state.rotationDegrees.z) - Math.abs(this.state.targetDegrees.z)) < 10) {

			if (!this.randomTimeout) {
				this.randomTimeout = setTimeout(() => {
					this.setRandomAngle();
				}, 1000);
			}
		} else {
			clearTimeout(this.randomTimeout);
			this.randomTimeout = null;
		}
	}

	setRandomAngle() {
		const x = (Math.random() * 180 - 90).toFixed(0);
		const y = (Math.random() * 180 - 90).toFixed(0);
		const z = (Math.random() * 360).toFixed(0);
		this.setState({
			gameStarted: true,
			targetDegrees: {
				x: x,
				y: y,
				z: z
			}
		});

		sendTargetOrientation({ 
			x: x,
			y: y,
			z: z
		});
	}

	render() {
		// Canvas size
		const size = 600;

		// Box sizing, segments
		let wireframe = false;
		const width = 60;
		const height = 100;
		const depth = 5;

		const widthSegments = 0;
		const heightSegments = 0;
		const depthSegments = 0;

		const color = new THREE.Color(0xffffff);

		// Convert Euler angles to Quaternions
		const z = this.state.rotationDegrees.z ? THREE.Math.degToRad( this.state.rotationDegrees.z ) : 0; // Z
		const x = this.state.rotationDegrees.x ? THREE.Math.degToRad( this.state.rotationDegrees.x ) : 0; // X'
		const y = this.state.rotationDegrees.y ? THREE.Math.degToRad( this.state.rotationDegrees.y ) : 0; // Y''

		let zee = new THREE.Vector3( 0, 0, 1 );
		let euler = new THREE.Euler();
		let q0 = new THREE.Quaternion();
		let q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) );

		euler.set( x, z, - y, 'YXZ' );

		let quaternion = new THREE.Quaternion();
		quaternion.setFromEuler( euler );
		quaternion.multiply( q1 );
		quaternion.multiply( q0.setFromAxisAngle( zee, 0 ) );

		this.rotation = quaternion;


		// Set up and control game state
		const welcomeVisible = !this.state.activeClientList.controller;
		// let welcomeVisible = false;

		let instructions = "";

		if (!welcomeVisible && !this.state.gameStarted) {
			if (this.state.inControl) {
				this.watchForStartGame();
			}
			instructions = "Hold your device flat to start";
		}

		if (this.state.gameStarted) {
			instructions = "Game has begun.  Good luck!";

			if (this.state.inControl) {
				this.watchForAngleAlignment();
			}

			const alpha = this.state.targetDegrees.z ? THREE.Math.degToRad( this.state.targetDegrees.z ) : 0; // Z
			const beta = this.state.targetDegrees.x ? THREE.Math.degToRad( this.state.targetDegrees.x ) : 0; // X'
			const gamma = this.state.targetDegrees.y ? THREE.Math.degToRad( this.state.targetDegrees.y ) : 0; // Y''
			
			euler.set( beta, alpha, - gamma, 'YXZ' );
			let randomQuaternion = new THREE.Quaternion();
			randomQuaternion.setFromEuler( euler );
			randomQuaternion.multiply( q1 );
			randomQuaternion.multiply( q0.setFromAxisAngle( zee, 0 ) );
			this.randomRotation = randomQuaternion;
		} else {
			this.randomRotation = new THREE.Quaternion();
		}

		let instructionsClass = "instructions";
		let opacity = 0;

		if (this.state.gameStarted) {
			instructionsClass += " green-background";
			opacity = 0.3;
		}

		return (
			<div className="app">
				<Welcome visible={welcomeVisible} />

				{ !this.state.inControl ? 
					<div className="main-canvas">
						<div className="orientation">{"X: " + this.state.rotationDegrees.x + ", " + "Y: " + this.state.rotationDegrees.y + ", " + "Z: " + this.state.rotationDegrees.z}</div>
						<div className={instructionsClass}>{instructions}</div>
						<React3 key={1} antialias={true} mainCamera="camera" width={size} height={size} alpha={true}>
							<scene>
								<perspectiveCamera name="camera" fov={50} aspect={1} near={0.1} far={1000} position={this.cameraPosition} rotation={this.cameraRotation}/>
								<mesh quaternion={this.rotation}>
									<boxGeometry ref="phone" width={width} height={height} depth={depth}
										widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
									<meshLambertMaterial wireframe={wireframe} color={color} vertexColors={THREE.VertexColors}>
									</meshLambertMaterial>
								</mesh>
								<mesh quaternion={this.randomRotation}>
									<boxGeometry ref="angle" width={width} height={height} depth={depth}
										widthSegments={widthSegments} heightSegments={heightSegments} depthSegments={depthSegments} />
									<meshLambertMaterial wireframe={wireframe} color={color} vertexColors={THREE.VertexColors} transparent={true} opacity={opacity}>
									</meshLambertMaterial>
								</mesh>
								}
								<object3D>
									<ambientLight/>
								</object3D>
								<directionalLight
									color={0xffffff}
									intensity={1.75}
									castShadow
									shadowMapWidth={1024}
									shadowMapHeight={1024}
									shadowCameraLeft={-20}
									shadowCameraRight={20}
									shadowCameraTop={20}
									shadowCameraBottom={-20}

									shadowCameraFar={3 * 20}
									shadowCameraNear={20}

									position={this.lightPosition}
									lookAt={this.lightTarget} />
							</scene>
						</React3>
					</div>

					:

					<Controller rotation={this.state.rotationDegrees} />
				}

			</div>
		);
	}
}

export default App;
