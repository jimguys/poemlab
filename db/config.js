var fs = require('fs'),
	path = require('path');

if(!fs.existsSync(path.join(__dirname, "./config.json"))) {
	console.log("The database config file was not found!");
	console.log("Please copy db/config.example.json to db/config.json and configure accordingly.");
	process.exit(1);
}

module.exports = require("./config.json");
