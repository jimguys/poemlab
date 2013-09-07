var _ = require('underscore');

var poems = [
  { id: 1, name: 'chon chon' },
  { id: 2, name: 'cuddly chang' }
];

exports.list = function(req, res) {
  res.render('poem/list', { poems: poems });
}

exports.edit = function(req, res) {
  var poem = _.find(poems, function(p) { return p.id == req.params.id; });
  res.render('poem/edit', { poem: poem })
}
