var fs = require('fs');
var path = require('path');

function requireIfExists(configFile) {
  if(!fs.existsSync(path.join(__dirname, configFile))) {
    console.error("Config file not found: " + configFile);
    console.error("Please copy corresponding example.json to " + configFile + " and configure accordingly.");
    process.exit(1);
  }

  return require(configFile);
}

module.exports.db = requireIfExists("./config/db.json");
module.exports.security = requireIfExists("./config/security.json");
