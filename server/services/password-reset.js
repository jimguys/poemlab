var nodemailer = require('nodemailer');
var crypto = require('crypto');
var urljoin = require('url-join');

const TOKEN_EXPIRE_SECONDS = 30*60;

module.exports = function(poets, redis, mailerTransport) {
  function storeToken(poetId, cb) {
    var token = crypto.randomBytes(16).toString('hex');
    var key = 'reset.' + token;
    redis.set(key, poetId, function(err) {
      if (err) { return cb(err); }
      redis.expire(key, TOKEN_EXPIRE_SECONDS, function(err) {
        if (err) { return cb(err); }
        cb(null, token);
      });
    });
  }

  function sendEmail(email, token, cb) {
    var resetLink = urljoin(process.env.SITE_BASE_URL, '/reset/' + token);
    var mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Poemlab password reset',
      text: 'To reset your password, follow this link: ' + resetLink
    };
    mailerTransport.sendMail(mailOptions, cb);
  }

  return {
    sendLink: function(email, cb) {
      poets.readByEmail(email, function(err, poet) {
        if (err) { return cb(err); }
        if (poet === undefined) {
          return cb('Email address not found');
        }
        storeToken(poet.id, function(err, token) {
          if (err) { return cb(err); }
          sendEmail(email, token, cb);
        });
      });
    },

    isTokenValid: function(token, cb) {
      redis.exists('reset.' + token, function(err, exists) {
        if (err) { return cb(err); }
        cb(null, exists);
      });
    },

    changePassword: function(token, newPassword, cb) {
      var key = 'reset.' + token;
      redis.get(key, function(err, id) {
        if (err) { return cb(err);  }
        if (!id) { return cb('Password reset request has expired. Please reset your password again.')}
        poets.changePassword(id, newPassword, function(err) {
          if (err) { return cb(err); }
          redis.del(key, cb);
        });
      });
    }
  }
};
