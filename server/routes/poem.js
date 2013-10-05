var respond = require('./common').respond;

module.exports = function(dbConfig) {
  var poemsRepo = require("../repositories/poems_repository")(dbConfig);
  var linesRepo = require("../repositories/lines_repository")(dbConfig);

  function readPoemDetails(poem, user, res) {
    poemsRepo.getPoets(poem.id, function(err, poets) {
      respond(err, res, function() {
        readPoemLines(poem, poets, user, res);        
      });
    });
  }

  function readPoemLines(poem, poets, user, res) {
    linesRepo.forPoem(poem.id, function(err, lines) {
      respond(err, res, function() {
        res.render('poem/edit', { poem: poem, poets: poets, user: user, lines: lines });
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
          res.render('poem/list', { poems: poems, user: req.user });
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
      res.render('poem/new', { user: req.user });
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
