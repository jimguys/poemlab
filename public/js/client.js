var socket = io.connect('/');

socket.on('newline', function (poemLine) {
	$('.poem').append('<div>' + poemLine + '</div>');
});

$('.newline-form').submit(function() {
	socket.emit('submitline', $('.newline').val());
	$('.newline').val('');
});
