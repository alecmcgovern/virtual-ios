import openSocket from 'socket.io-client';

// const socket = openSocket('http://localhost:8000');
const socket = openSocket(window.location.hostname);

function subscribeToClientConnection(callback) {
	socket.on('clientConnected', clientConnected => callback(null, clientConnected));
}

function subscribeToClientDisconnection(callback) {
	socket.on('clientDisconnected', clientDisconnected => callback(null, clientDisconnected));
}

function subscribeToActiveClientList(callback) {
	socket.on('activeClientList', activeClientList => callback(null, activeClientList));
}

function subscribeToMessages(callback) {
	socket.on('messageReceived', messageReceived => callback(null, messageReceived));
}

function sendMessage(message) {
	socket.emit('sendMessage', message);
}

export { subscribeToActiveClientList, subscribeToClientConnection, subscribeToClientDisconnection, subscribeToMessages, sendMessage };