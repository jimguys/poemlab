const Browser = require('zombie');
const portfinder = require('portfinder');

module.exports = function() {
  return new Promise(function(fulfill, reject) {
    portfinder.getPort(function (err, port) {
      process.env.PORT = port;
      require('../../app');
    });

    process.on('ready', function(port) {
      Browser.localhost('localhost', port);
      fulfill(new Browser());
    });
  });
};
