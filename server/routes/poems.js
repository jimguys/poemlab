var respond = require('./common').respond;

module.exports = function(db) {
  var poetsRepo = require("../repositories/poets_repository")(db);
  var poemsRepo = require("../repositories/poems_repository")(db);
  var linesRepo = require("../repositories/lines_repository")(db);

  function readPoemDetails(poem, user, res) {
    poetsRepo.forPoem(poem.id, function(err, poets) {
      respond(err, res, function() {
        readPoemLines(poem, poets, user, res);
      });
    });
  }

  function readPoemLines(poem, poets, user, res) {
    linesRepo.forPoem(poem.id, function(err, lines) {
      respond(err, res, function() {
        res.render('poems/edit', { poem: poem, poets: poets, user: user, lines: lines });
      });
    });
  }

  function addPoetsToPoem(poem, poetIds, res) {
    poemsRepo.addPoets(poem.id, poetIds, function(err) {
      respond(err, res, function() {
        res.redirect('/poems/' + poem.id);
      });
    });
  }

  return {

    list: function(req, res) {
      poemsRepo.forPoet(req.user.id, function(err, poems) {
        respond(err, res, function() {
          res.render('poems/list', { poems: poems, user: req.user });
        });
      });
    },

    edit: function(req, res) {
      var poemId = req.params.id;
      poemsRepo.read(poemId, function(err, poem) {
        respond(err, res, function() {
          readPoemDetails(poem, req.user, res);
        });
      });
    },

    createForm: function(req, res) {
      res.render('poems/new', { user: req.user });
    },

    create: function(req, res) {
      poemsRepo.create({ name: req.body.name }, function(err, poem) {
        respond(err, res, function() {
          var poetIds = [].concat(req.body.poets);
          addPoetsToPoem(poem, poetIds, res);
        });
      });
    }
  };

};
