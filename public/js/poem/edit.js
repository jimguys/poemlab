$(function() {
  var poemEl = $('#poem');
  var poemId = poemEl.data('poem-id');
  var socket = io.connect('/');

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    $('<div/>', {
      'class': 'line',
      'text': poemLine.text
    }).appendTo(poemEl);
  });

  $('.newline-form').submit(function() {
    var lineTextEl = $(this).find('.line-text');
    var lineData = {
      poem_id: poemId,
      text: lineTextEl.val()
    };
    $.post('/line', lineData);
    lineTextEl.val('');
  });
});
