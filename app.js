var express = require('express'),
	app = express(), 
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

app.use(express['static'](__dirname + '/public'));

server.listen(80);

io.sockets.on('connection', function (socket) {
  socket.on('submitline', function (poemLine) {
	  socket.emit('newline', poemLine);
	  socket.broadcast.emit('newline', poemLine);
  });
});