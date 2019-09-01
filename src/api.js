import openSocket from 'socket.io-client';

// const socket = openSocket('http://localhost:8000');
// const socket = openSocket('192.168.1.15:8000');
const socket = openSocket(window.location.hostname);


// CLIENT CONNECTION CONTROLS
function subscribeToClientConnection(callback) {
	socket.on('clientConnected', clientConnected => callback(null, clientConnected));
}

function subscribeToClientDisconnection(callback) {
	socket.on('clientDisconnected', clientDisconnected => callback(null, clientDisconnected));
}

function subscribeToActiveClientList(callback) {
	socket.on('activeClientList', activeClientList => callback(null, activeClientList));
}

function sendDeviceType(deviceType) {
	socket.emit('sendDeviceType', deviceType);
}

function subscribeToControllingUserResponse(callback) {
	socket.on('controllingUserResponse', controllingUserResponse => callback(null, controllingUserResponse));
}


// ORIENTATION CONTROLS
function subscribeToOrientation(callback) {
	socket.on('orientationReceived', orientationReceived => callback(null, orientationReceived));
}

function subscribeToTargetOrientation(callback) {
	socket.on('targetOrientationReceived', targetOrientationReceived => callback(null, targetOrientationReceived));
}

function sendOrientation(orientation) {
	socket.emit('sendOrientation', orientation);
}

function sendTargetOrientation(targetOrientation) {
	socket.emit('sendTargetOrientation', targetOrientation);
}

export { 
	sendDeviceType, 
	subscribeToActiveClientList, 
	subscribeToClientConnection, 
	subscribeToClientDisconnection,
	subscribeToControllingUserResponse,

	subscribeToOrientation,
	subscribeToTargetOrientation, 
	sendOrientation,
	sendTargetOrientation  
};

