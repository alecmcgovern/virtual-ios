import openSocket from 'socket.io-client';

// const socket = openSocket('http://localhost:8000');
const socket = openSocket(window.location.hostname);

function subscribeToMessages(callback) {
	socket.on('messageReceived', messageReceived => callback(null, messageReceived));
}

function sendMessage(message) {
	socket.emit('sendMessage', message);
}

export { subscribeToMessages, sendMessage };