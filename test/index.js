const Browser = require('zombie');
const portfinder = require('portfinder');

var browserReady = new Promise(function(fulfill, reject) {
  portfinder.getPort(function (err, port) {
    process.env.PORT = port;
    require('../app');
  });

  process.on('ready', function(port) {
    Browser.localhost('localhost', port);
    fulfill();
  });
});

describe('User visits the site', function() {
  const browser = new Browser();

  before(function() {
    return browserReady.then(function() {
      return browser.visit('/');
    });
  });

  describe('visits main page', function() {
    it('should see the title', function() {
      browser.assert.text('title', 'Poemlab');
    });
  });
});
