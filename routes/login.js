exports.get = function(req, res) {
  res.render('login', { title: 'Poem Lab' });
}

exports.post = function(req, res) {
  res.redirect('/poem');
}
