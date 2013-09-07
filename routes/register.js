exports.get = function(req, res) {
  res.render('register', { title: 'Pocolabs' });
}

exports.post = function(req, res) {
  res.redirect('/poem');
}

