var _ = require('underscore');

var PoemsRepository = require('../lib/repositories/poems_repository.js');
var poemsRepo = new PoemsRepository();

exports.list = function(req, res) {
	poemsRepo.all(function(err, poems) {
		res.render('poem/list', { poems: poems });
	});
};

exports.edit = function(req, res) {
	poemsRepo.read(req.params.id, function(err, poem) {
		res.render('poem/edit', { poem: poem });
	});
};

exports.createform = function(req, res) {
	res.render('poem/new');
};

exports.create = function(req, res) {
	poemsRepo.create({ name: req.body.name }, function(err, poem) {
		res.redirect('/poem/' + poem.id);
	});
};
