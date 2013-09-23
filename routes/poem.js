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

  function addPoetsToPoem(poem, poetIds, res) {
    poemsRepo.addPoets(poem.id, poetIds, function(err) {
      respond(err, res, function() {
        res.redirect('/poem/' + poem.id);
      });
    });
  }

  return {

    list: function(req, res) {
      poemsRepo.forPoet(req.user.id, function(err, poems) {
        respond(err, res, function() {
          res.render('poem/list', { poems: poems, poet: req.user });
        });
      });
    },

    edit: function(req, res) {
      var poemId = req.params.id;
      poemsRepo.read(poemId, function(err, poem) {
        respond(err, res, function() {
          readPoemLines(poem, req.user, res);
        });
      });
    },

    createForm: function(req, res) {
      res.render('poem/new');
    },

    create: function(req, res) {
      poemsRepo.create({ name: req.body.name }, function(err, poem) {
        respond(err, res, function() {
          var poetIds = req.body.poets;
          poetIds.push(req.user.id);
          addPoetsToPoem(poem, poetIds, res);
        });
      });
    }
  };

};
