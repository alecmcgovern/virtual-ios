import openSocket from 'socket.io-client';

// const socket = openSocket('http://localhost:8000');
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

function subscribeToControllingUserConnected(callback) {
	socket.on('controllingUserConnected', controllingUserConnected => callback(null, controllingUserConnected));
}

function sendDeviceType(deviceType) {
	socket.emit('sendDeviceType', deviceType);
}


// ORIENTATION CONTROLS
function subscribeToOrientation(callback) {
	socket.on('orientationReceived', orientationReceived => callback(null, orientationReceived));
}

function sendOrientation(orientation) {
	socket.emit('sendOrientation', orientation);
}


export { 
	sendDeviceType, 
	subscribeToActiveClientList, 
	subscribeToClientConnection, 
	subscribeToClientDisconnection, 
	subscribeToControllingUserConnected,

	subscribeToOrientation, 
	sendOrientation 
};

