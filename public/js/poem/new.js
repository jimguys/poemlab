$(function() {
  $('.poetsearch').typeahead({
    name: 'poets',
    remote: '/poet?q=%QUERY',
    valueKey: 'name'
  }).on('typeahead:selected', function(element, poet) {
    var poets = $(this).closest('form').find('.poets');
    $('<li/>', {
      'data-poet-id': poet.id,
      'text': poet.name
    }).appendTo(poets);
    $(this).typeahead('setQuery', '');
  });
});