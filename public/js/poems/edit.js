$(function() {
  var socket = io.connect('/');
  var poemContainer = $('#poem-edit-header');
  var poemId = poemContainer.data('poem-id');
  var linesContainer = $('#lines');
  var lineTextInput = poemContainer.find('.line-text');

  function assignColorToLine(lineElement) {
    var poetId = $(lineElement).data('poet-id');
    var poetColor = poemContainer.find('.poet[data-poet-id=' + poetId + ']').css('background-color');
    $(lineElement).find('.box').css('background-color', poetColor);
  }

  (function assignColorsToPoets() {
    var poetColors = [
      '#a8aabd','#8db099','#abb08d','#b08f8d','#b08daa',
      '#8d8db0','#8da6b0','#8db095','#aab08d'];
    var poets = poemContainer.find('.poet').each(function(i, el) {
      $(el).css('background-color', poetColors[i % poetColors.length]);
    });
    linesContainer.find('.line').each(function(i, el) {
      assignColorToLine(el);
    });
  })();

  socket.on('line-created-for-poem-' + poemId, function(poemLine) {
    var lineDiv = $(jade.render('server/views/partials/line.jade', { line: poemLine }));
    lineDiv.appendTo(linesContainer);
    assignColorToLine(lineDiv);
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
