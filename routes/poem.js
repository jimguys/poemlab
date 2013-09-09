var _ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	PoemsRepository = require('../lib/repositories/poems_repository.js');

var dbConfig;
if(fs.existsSync(path.join(__dirname, "../db/config.json"))) {
	dbConfig = require("../db/config.json");
} else {
	console.log("The database config file was not found!");
	process.exit(1);
}

var poemsRepo = new PoemsRepository(dbConfig);

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
