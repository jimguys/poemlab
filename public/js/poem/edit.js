$(function() {
  var socket = io.connect('/');
  var poemContainer = $('#poem-edit-header');
  var poemId = poemContainer.data('poem-id');
  var linesContainer = $('#lines');
  var lineTextInput = poemContainer.find('.line-text');

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    $('<div/>', {
      'class': 'line',
      'text': poemLine.text
    }).appendTo(linesContainer);
    $(document).scrollTop($(document).height());
    lineTextInput.focus();
  });

  poemContainer.find('.newline-form').submit(function() {
    var lineData = {
      poemId: poemId,
      text: lineTextInput.val()
    };
    $.post('/line', lineData);
    lineTextInput.val('');
  });
});
