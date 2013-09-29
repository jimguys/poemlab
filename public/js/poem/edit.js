$(function() {
  var socket = io.connect('/');
  var poemContainer = $('#poem-edit-header');
  var poemId = poemContainer.data('poem-id');
  var linesContainer = $('#lines');

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    $('<div/>', {
      'class': 'line',
      'text': poemLine.text
    }).appendTo(linesContainer);
    $(document).scrollTop($(document).attr('height'));
  });

  poemContainer.find('.newline-form').submit(function() {
    var lineTextInput = $(this).find('.line-text');
    var lineData = {
      poemId: poemId,
      text: lineTextInput.val()
    };
    $.post('/line', lineData);
    lineTextInput.val('');
  });
});
