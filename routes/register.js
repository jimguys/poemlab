exports.get = function(req, res) {
  res.render('register', { title: 'Poem Lab' });
}

exports.post = function(req, res) {
  res.redirect('/poem');
}
