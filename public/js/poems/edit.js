$(function() {
  var socket = io.connect('/');
  var poemContainer = $('#poem-edit-header');
  var poemId = poemContainer.data('poem-id');
  var linesContainer = $('#lines');
  var lineTextInput = poemContainer.find('.line-text');
  var poetsContainer = poemContainer.find('.poets');

  function setNewlinePanelVisibility() {
    if (poemContainer.data('poet-id') === poetsContainer.find('.poet').data('poet-id')) {
      poemContainer.find('.waitpanel').hide();
      poemContainer.find('.newline-form').show();
    } else {
      poemContainer.find('.waitpanel').show();
      poemContainer.find('.newline-form').hide();
    }
  }

  socket.on('connect', function() {
    socket.emit('joinPoem', poemId);
    setNewlinePanelVisibility();
  });

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', { line: poemLine }));
    lineDiv.appendTo(linesContainer);
    $(document).scrollTop($(document).height());
    lineTextInput.focus();
  });

  socket.on('poet-turn-for-poem-' + poemId, function(poet) {
    var poetDiv = poetsContainer.find('.poet[data-poet-id=' + poet.id + ']');
    poetsContainer.prepend(poetDiv);
    setNewlinePanelVisibility();
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
