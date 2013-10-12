var respond = require('./common').respond;
var _ = require('underscore');

module.exports = function(dbConfig) {
  var poetsRepo = require("../repositories/poets_repository")(dbConfig);

  return {

    search: function(req, res) {
      poetsRepo.search(req.query.q, function(err, poets) {
        respond(err, res, function() {
          var poetData = _.map(poets, function(p) {
            return _.pick(p, ['id', 'name']);
          });
          res.json(poetData);
        });
      });
    }
  };

};
