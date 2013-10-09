$(function() {

  var poetSearch = $('.poetsearch');
  var poetsList = poetSearch.closest('form').find('.poets');

  poetSearch.typeahead({
    name: 'poets',
    valueKey: 'name',
    remote: {
      url: '/poets?q=%QUERY',
      filter: function(poets) {
        return poets.filter(function(p) {
          return poetsList.find('input[value=' + p.id + ']').length === 0;
        });
      }
    }
  }).on('typeahead:selected', function(element, poet) {
    var li = $('<li/>', {
      text: poet.name
    }).appendTo(poetsList);

    $('<input/>', {
      type: 'hidden',
      name: 'poets',
      value: poet.id
    }).appendTo(li);

    $(this).typeahead('setQuery', '');
  });
});
