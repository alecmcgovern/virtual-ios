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
	io.clients((err, clients) => {
		io.emit('activeClientList', clients);
	});

	client.on('sendMessage', (message) => {
		console.log("client sent this message: " + message);
		io.emit('messageReceived', message);
	});

	client.on('disconnect', (reason) => {
		console.log(client.id + " disconnected because: " + reason);
		io.emit('clientDisconnected', client.id);
		io.clients((err, clients) => {
			io.emit('activeClientList', clients);
		});
	})

	// setTimeout(() => {
	// 	client.disconnect(true);
	// }, 5000);
});

server.listen(PORT, () => {
	console.log('video app is listening on port ' + PORT);
});