$(function() {
  $('.poetsearch').typeahead({
    name: 'poets',
    remote: '/poet?q=%QUERY',
    valueKey: 'name'
  }).on('typeahead:selected', function(element, poet) {
    var poets = $(this).closest('form').find('.poets');

    var li = $('<li/>', {
      text: poet.name
    }).appendTo(poets);

    $('<input/>', {
      type: 'hidden',
      name: 'poets',
      value: poet.id
    }).appendTo(li);

    $(this).typeahead('setQuery', '');
  });
});