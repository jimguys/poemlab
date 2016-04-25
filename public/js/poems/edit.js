$(function() {
  var socket = io.connect('/');
  var poemContainer = $('.newline-form');
  var poem = { id: poemContainer.data('poem-id') };
  var poetPosition = poemContainer.data('poet-position');
  var linesContainer = $('.poem-lines');
  var lineTextInput = poemContainer.find('.new-line-text');
  var synth = window.speechSynthesis;
  var speech = synth && new SpeechSynthesisUtterance();

  $.fn.editable.defaults.mode = 'inline';

  $('.poem-lines').on('click', '.column', function(e) {
    if ($(this).find('.editable-open').length) {
      return;
    }
    e.stopPropagation();

    var lineText = $(this).find('.line-text.mine');
    if (lineText.length === 0) {
      return;
    }

    var lineId = $(this).closest('.line').data('line-id');

    lineText.editable({
      name: 'text',
      url: '/lines/' + lineId,
      pk: lineId,
      showbuttons: true,
      emptytext: '',
      title: 'edit',
      toggle: 'manual',
      tpl: '<input type="text" maxlength="200">'
    });

    lineText.editable('toggle');
  });

  socket.on('connect', function() {
    socket.emit('joinPoem', poem.id);
  });

  socket.on('line-created-for-poem-' + poem.id, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', { line: poemLine, mine: true }));
    lineDiv.appendTo(linesContainer);
    lineTextInput.focus();
  });

  $('.post-line').on('click', postLine);

  $('.new-line-text').on('keyup', function() {
    var disabled = $(this).val().length === 0;
    $('.post-line').attr('disabled', disabled);
  });

  $('.new-line-text').on('keypress', function(e) {
    if ($('.post-line:enabled').length > 0 && e.keyCode == 13) {
      postLine();
      return false;
    }
  });

  function postLine() {
    var line = {
      poemId: poem.id,
      poetPosition: poetPosition,
      text: lineTextInput.val()
    };
    $.post('/lines', line);
    lineTextInput.val('');
  }

  if (synth) {
    $('.speak').removeClass('hidden');
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
