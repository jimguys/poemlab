var express = require('express'),
app = express(), 
http = require('http'),
server = http.createServer(app),
io = require('socket.io').listen(server),
escape = require('escape-html');

app.use(express['static'](__dirname + '/public'));

server.listen(80);

io.sockets.on('connection', function (socket) {
	socket.on('submitline', function (poemLine) {
		var escapedLine = escape(poemLine);	
		socket.emit('newline', escapedLine);
		socket.broadcast.emit('newline', escapedLine);
	});
});