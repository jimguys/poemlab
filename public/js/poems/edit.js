$(function() {
  var socket = io.connect('/');
  var poemContainer = $('.newline-form');
  var poem = { id: poemContainer.data('poem-id') };
  var linesContainer = $('.poem-lines');
  var lineTextInput = poemContainer.find('.line-text');

  socket.on('connect', function() {
    socket.emit('joinPoem', poem.id);
  });

  socket.on('line-created-for-poem-' + poem.id, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', {
      line: poemLine,
      poets: $('.poet').map(function(i, poet) { return { id: $(poet).data('poet-id') }; })
    }));
    lineDiv.appendTo(linesContainer);
    lineTextInput.focus();
  });

  poemContainer.submit(function() {
    var lineData = {
      poemId: poem.id,
      text: lineTextInput.val()
    };
    $.post('/lines', lineData);
    lineTextInput.val('');
  });
});
