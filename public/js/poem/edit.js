var socket = io.connect('/');

socket.on('line-created', function(poemLine) {
  $('<div/>', {
    'class': 'line',
    'text': poemLine.text
  }).appendTo('.poem');
});

$('.newline-form').submit(function() {
  var lineTextEl = $(this).find('.line-text');
  var lineData = {
    poem_id: $(this).data('poem-id'),
    poet_id: $(this).data('poet-id'),
    text: lineTextEl.val()
  };
  socket.emit('line-submitted', lineData);
  lineTextEl.val('');
});
