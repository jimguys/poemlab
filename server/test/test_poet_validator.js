// Just a little script to run through some of the functionality of PoetValidator
// Not an actual test!

var pg = require('pg');
var config = require("../../config");
var poetsRepo = require("../repositories/poets_repository")(config.db);
var poetValidator = require("../services/poet_validator")(poetsRepo);

var emptyPoet = {};
var duplicatePoet = { username: "drueck", email: "drueck@gmail.com", password: "asldkfslkjdf" };
var validPoet = { username: "nonexistent", email: "non@existe.nt", password: "frommage" };

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
	testValidate(duplicatePoet, function() {
		testValidate(validPoet, function() {
			pg.end();
		});
	});
});
