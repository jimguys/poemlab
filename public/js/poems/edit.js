$(function() {
  var socket = io.connect('/');
  var poemContainer = $('.newline-form');
  var poem = { id: poemContainer.data('poem-id') };
  var poetPosition = poemContainer.data('poet-position');
  var linesContainer = $('.poem-lines');
  var lineTextInput = poemContainer.find('.line-text');
  var synth = window.speechSynthesis;
  var speech = synth && new SpeechSynthesisUtterance();

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
      poetPosition: poetPosition,
      text: lineTextInput.val()
    };
    $.post('/lines', line);
    lineTextInput.val('');
  });

  if (synth) {
    $('.speak').show();
  }

  $('.speak').click(function(event) {
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
