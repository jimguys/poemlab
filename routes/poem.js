module.exports = function(dbConfig) {
  var poemsRepo = require("../lib/repositories/poems_repository")(dbConfig);
  var linesRepo = require("../lib/repositories/lines_repository")(dbConfig);

  function respond(err, res, successCallback) {
    if (err) {
      console.log('***ERROR: ' + err);
      res.send(500, 'Internal server error');
    } else {
      successCallback(res);
    }
  }

  function readPoemLines(poem, res) {
    linesRepo.forPoem(poem.id, function(err, lines) {
      respond(err, res, function() {
        res.render('poem/edit', { poem: poem, lines: lines });
      });
    });
  }

  return {

    list: function list(req, res) {
      poemsRepo.all(function(err, poems) {
        respond(err, res, function() {
          res.render('poem/list', { poems: poems });
        });
      });
    },

    edit: function edit(req, res) {
      var poemId = req.params.id;
      poemsRepo.read(poemId, function(err, poem) {
        respond(err, res, function() {
          readPoemLines(poem, res);
        });
      });
    },

    createForm: function createForm(req, res) {
      res.render('poem/new');
    },

    create: function create(req, res) {
      poemsRepo.create({ name: req.body.name }, function(err, poem) {
        respond(err, res, function() {
          res.redirect('/poem/' + poem.id);
        });
      });
    }
  };

};
