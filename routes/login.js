exports.get = function(req, res) {
  res.render('login', { title: 'Pocolabs' });
}

exports.post = function(req, res) {
  res.redirect('/poem');
}
