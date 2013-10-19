$(function() {
  var socket = io.connect('/');
  var poemContainer = $('#poem-edit-header');
  var poemId = poemContainer.data('poem-id');
  var linesContainer = $('#lines');
  var lineTextInput = poemContainer.find('.line-text');

  socket.on('connect', function() {
    socket.emit('joinPoem', poemId);
  });

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', {
      line: poemLine,
      poets: $('.poet').map(function(i, poet) { return { id: $(poet).data('poet-id') }; })
    }));
    lineDiv.appendTo(linesContainer);
    $(document).scrollTop($(document).height());
    lineTextInput.focus();
  });

  poemContainer.find('.newline-form').submit(function() {
    var lineData = {
      poemId: poemId,
      text: lineTextInput.val()
    };
    $.post('/lines', lineData);
    lineTextInput.val('');
  });
});
