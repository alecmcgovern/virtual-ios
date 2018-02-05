const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let controllingUserId = null;

io.on('connection', function(client) {
	// CONNECT / DISCONNECT
	console.log(client.id + " connected");
	io.emit('clientConnected', client.id);
	io.clients((err, clients) => {
		io.emit('activeClientList', clients);
	});

	client.on('disconnect', (reason) => {
		console.log(client.id + " disconnected because: " + reason);
		io.emit('clientDisconnected', client.id);

		if (controllingUserId === client.id) {
			controllingUserId = null;
			io.emit('controllingUserDisconnected', controllingUserId);
		}

		io.clients((err, clients) => {
			io.emit('activeClientList', clients);
		});
	});

	client.on('sendDeviceType', (deviceType) => {
		if (deviceType === "iOS" && controllingUserId === null) {
			controllingUserId = client.id;
			io.emit('controllingUserConnected', controllingUserId);
		}
	});

	// send device orientation
	client.on('sendOrientation', (orientation) => {
		if (controllingUserId === client.id) {
			console.log("client sent an orientation: ");
			io.emit('orientationReceived', orientation);
		}
	});

});

server.listen(PORT, () => {
	console.log('video app is listening on port ' + PORT);
});