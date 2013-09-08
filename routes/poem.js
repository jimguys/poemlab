var _ = require('underscore');

var poems = [
  { id: 1, name: 'chon chon' },
  { id: 2, name: 'cuddly chang' },
  { id: 3, name: 'billy grippa' }
];

exports.list = function(req, res) {
  res.render('poem/list', { poems: poems });
}

exports.edit = function(req, res) {
  console.log('poems', poems);
  var poem = _.find(poems, function(p) { return p.id == req.params.id; });
  res.render('poem/edit', { poem: poem });
}

exports.createform = function(req, res) {
  res.render('poem/new');
}

exports.create = function(req, res) {
  var poem = { id: poems.length + 1, name: req.body.name };
  poems.push(poem);
  res.redirect('/poem/' + poem.id);
}
