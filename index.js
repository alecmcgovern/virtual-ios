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

io.on('connection', function(client) {
	console.log(client.id + " connected");
	io.emit('clientConnected', client.id);

	client.on('sendMessage', (message) => {
		console.log("client sent this message: " + message);
		io.emit('messageReceived', message);
	});
});

io.on('disconnect', function(client) {
	console.log(client.id + " disconnected");
	io.emit('clientDisconnected', client.id);
});

server.listen(PORT, () => {
	console.log('video app is listening on port ' + PORT);
});