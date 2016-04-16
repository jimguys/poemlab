$(function() {
  var socket = io.connect('/');
  var poemContainer = $('.newline-form');
  var poem = { id: poemContainer.data('poem-id') };
  var linesContainer = $('.poem-lines');
  var lineTextInput = poemContainer.find('.line-text');
  var synth = window.speechSynthesis;
  var speech = new SpeechSynthesisUtterance();

  socket.on('connect', function() {
    socket.emit('joinPoem', poem.id);
  });

  socket.on('line-created-for-poem-' + poem.id, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', { line: poemLine }));
    lineDiv.appendTo(linesContainer);
    lineTextInput.focus();
  });

  poemContainer.submit(function() {
    var line = {
      poemId: poem.id,
      text: lineTextInput.val()
    };
    $.post('/lines', line);
    lineTextInput.val('');
  });

  $('.speak').click(function(event) {
    event.preventDefault();
    var lines = $('.line').map(function() {
      return {
        id: $(this).data('line-id'),
        text: $(this).text()
      };
    });

    var play = function(i) {
      if (i < lines.length) {
        $('.line[data-line-id=' + lines[i].id + ']').addClass('playing');
        speech.text = lines[i].text;
        speech.onend = function() {
          setTimeout(function() {
            $('.line').removeClass('playing');
            play(i + 1);
          }, 500);
        };
        synth.speak(speech);
      }
    };

    play(0);
  });
});
