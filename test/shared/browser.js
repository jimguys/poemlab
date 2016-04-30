const Browser = require('zombie');
const portfinder = require('portfinder');

module.exports = function(mailerTransport) {
  return new Promise(function(fulfill, reject) {
    portfinder.getPort(function (err, port) {
      if (require.cache[require.resolve('../../app')] === undefined) {
        process.env.PORT = port;
        process.env.EMAIL_SMTP_TRANSPORT = 'mock';
        process.env.SITE_BASE_URL = 'http://localhost:' + port;
        require('../../app');
      }
    });

    process.on('ready', function(port) {
      Browser.localhost('localhost', port);
      fulfill(new Browser());
    });
  });
};
