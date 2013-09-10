var PoemsRepository = require("../lib/repositories/poems_repository");

module.exports = function(dbConfig) {

	var poemsRepo = new PoemsRepository(dbConfig);

	return {

		list: function list(req, res) {
			poemsRepo.all(function(err, poems) {
				res.render('poem/list', { poems: poems });
			});
		},

		edit: function edit(req, res) {
			poemsRepo.read(req.params.id, function(err, poem) {
				res.render('poem/edit', { poem: poem });
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
