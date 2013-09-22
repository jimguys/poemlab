var respond = require('./common').respond;

module.exports = function(dbConfig) {
  var poemsRepo = require("../lib/repositories/poems_repository")(dbConfig);
  var linesRepo = require("../lib/repositories/lines_repository")(dbConfig);

  function readPoemLines(poem, poet, res) {
    linesRepo.forPoem(poem.id, function(err, lines) {
      respond(err, res, function() {
        res.render('poem/edit', { poem: poem, poet: poet, lines: lines });
      });
    });
  }

  function addPoetToPoem(poem, poet, res) {
    poemsRepo.addPoet(poem.id, poet.id, function(err) {
      respond(err, res, function() {
        res.redirect('/poem/' + poem.id);
      });
    });
  }

  return {

    list: function list(req, res) {
      poemsRepo.forPoet(req.user.id, function(err, poems) {
        respond(err, res, function() {
          res.render('poem/list', { poems: poems, poet: req.user });
        });
      });
    },

    edit: function edit(req, res) {
      var poemId = req.params.id;
      poemsRepo.read(poemId, function(err, poem) {
        respond(err, res, function() {
          readPoemLines(poem, req.user, res);
        });
      });
    },

    createForm: function createForm(req, res) {
      res.render('poem/new');
    },

    create: function create(req, res) {
      poemsRepo.create({ name: req.body.name }, function(err, poem) {
        respond(err, res, function() {
          addPoetToPoem(poem, req.user, res);
        });
      });
    }
  };

};
