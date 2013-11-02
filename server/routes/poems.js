var respond = require('./common').respond;

module.exports = function(dbConfig, poemRegistry) {
  var poemsRepo = require("../repositories/poems_repository")(dbConfig);

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
      poemRegistry.get(poemId, function(err, poem) {
        respond(err, res, function() {
          res.render('poems/edit', { poem: poem, user: req.user, poets: poem.poets });
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
