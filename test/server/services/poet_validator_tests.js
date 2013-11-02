// Just a little script to run through some of the functionality of PoetValidator
// Not an actual test!

var pg = require('pg');
var config = require("../../../config");
var poetsRepo = require("../../../server/repositories/poets_repository")(config.db);
var poetValidator = require("../../../server/services/poet_validator")(poetsRepo);

var emptyPoet = {};
var invalidEmailPoet = { username: "nonexistent", email: "nonexistent", password: "075f0956584cfa8d32beb384fcf51ce3ee30a7e5aeee6434acc222928a30db3e" };
var duplicatePoet = { username: "drueck", email: "drueck@gmail.com", password: "075f0956584cfa8d32beb384fcf51ce3ee30a7e5aeee6434acc222928a30db3e" };
var unhashedPoet = { username: "nonexistent", email: "non@existe.nt", password: "unhashed" };
var validPoet = { username: "nonexistent", email: "non@existe.nt", password: "075f0956584cfa8d32beb384fcf51ce3ee30a7e5aeee6434acc222928a30db3e" };

function testValidate(poet, done) {
  poetValidator.validate(poet, function(valid, errors) {
    console.log("testing validate with poet: ", poet);
    console.log("valid: ", valid);
    console.log("errors: ", errors);
    console.log("");
    done();
  });
}

testValidate(emptyPoet, function() {
  testValidate(invalidEmailPoet, function() {
    testValidate(duplicatePoet, function() {
      testValidate(unhashedPoet, function() {
        testValidate(validPoet, function() {
          pg.end();
        });
      });
    });
  });
});
