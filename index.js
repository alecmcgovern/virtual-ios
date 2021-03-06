const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const PORT = process.env.PORT || 8000;

app.use(requireHTTPS);
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let controllingUserId = null;

let activeClients = { 
	controller: null, 
	allUsers: []
}

io.on('connection', function(client) {
	// CONNECT / DISCONNECT
	console.log(client.id + " connected");
	io.emit('clientConnected', client.id);
	io.clients((err, clients) => {
		activeClients.allUsers = clients;
		activeClients.controller = controllingUserId;
		io.emit('activeClientList', activeClients);
	});

	client.on('disconnect', (reason) => {
		console.log(client.id + " disconnected because: " + reason);
		io.emit('clientDisconnected', client.id);

		if (controllingUserId === client.id) {
			controllingUserId = null;
			io.emit('controllingUserDisconnected', controllingUserId);
		}

		io.clients((err, clients) => {
			activeClients.allUsers = clients;
			activeClients.controller = controllingUserId;
			io.emit('activeClientList', activeClients);
		});
	});

	client.on('sendDeviceType', (deviceType) => {
		if (deviceType === "iOS" || deviceType === "Android") {
			if (controllingUserId === null) {
				controllingUserId = client.id;

				activeClients.controller = controllingUserId;
				io.emit('activeClientList', activeClients);

				client.emit('controllingUserResponse', true);
			} else {
				client.emit('controllingUserResponse', false);
			}
		} else {
			client.emit('controllingUserResponse', false);
		}
	});

	// send device orientation
	client.on('sendOrientation', (orientation) => {
		if (controllingUserId === client.id) {
			io.emit('orientationReceived', orientation);
		}
	});

	client.on('sendTargetOrientation', (targetOrientation) => {
		if (controllingUserId === client.id) {
			io.emit('targetOrientationReceived', targetOrientation);
		}
	});
});

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

server.listen(PORT, () => {
	console.log('video app is listening on port ' + PORT);
});