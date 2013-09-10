var PoemsRepository = require("../lib/repositories/poems_repository");
var LinesRepository = require("../lib/repositories/lines_repository");

module.exports = function(dbConfig) {

	var poemsRepo = new PoemsRepository(dbConfig);
	var linesRepo = new LinesRepository(dbConfig);

	return {

		list: function list(req, res) {
			poemsRepo.all(function(err, poems) {
				res.render('poem/list', { poems: poems });
			});
		},

		edit: function edit(req, res) {
			var poemId = req.params.id;
			poemsRepo.read(poemId, function(err, poem) {
				linesRepo.forPoem(poemId, function(err, lines) {
					res.render('poem/edit', { poem: poem, lines: lines });
				});
			});
		},

		createForm: function createForm(req, res) {
			res.render('poem/new');
		},

		create: function create(req, res) {
			poemsRepo.create({ name: req.body.name }, function(err, poem) {
				res.redirect('/poem/' + poem.id);
			});
		}

	};

};
