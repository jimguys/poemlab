var config = require("./config.js");

var express = require('express');
var http = require('http');
var path = require('path');
var escape = require('escape-html');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: config.security.sessionKey }));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// route registration
require('./routes')(app, config.db);

// start the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.io
io.sockets.on('connection', function (socket) {
	socket.on('submitline', function (poemLine) {
		var escapedLine = escape(poemLine);
		socket.emit('newline', escapedLine);
		socket.broadcast.emit('newline', escapedLine);
	});
});
