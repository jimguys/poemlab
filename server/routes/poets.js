var respond = require('./common').respond;
var _ = require('underscore');

module.exports = function(db) {
  var poetsRepo = require("../repositories/poets_repository")(db);

  return {
    search: function(req, res) {
      poetsRepo.search(req.query.q, function(err, poets) {
        respond(err, res, function() {
          var poetData = _.map(poets, function(p) {
            return _.pick(p, ['id', 'username', 'color']);
          });
          res.json(poetData);
        });
      });
    }
  };

};
