var respond = require('./common').respond;

module.exports = function(passwordReset) {
 return {

    get: function(req, res) {
      res.render('account/password-reset');
    },

    post: function(req, res) {
      passwordReset.sendLink(req.body.email, function(err) {
        if (err) {
          res.render('account/password-reset', { errors: [err] });
        } else {
          res.render('account/password-reset', { success: 'Password reset link send to ' + req.body.email });
        }
      });
    },

    reset: function(req, res) {
      passwordReset.isTokenValid(req.params.token, function(err, valid) {
        if (err) {
          return res.render('account/password-change', { errors: [err] });
        }
        if (!valid) {
          return res.render('account/password-change', { expired: true });
        }
        res.render('account/password-change', { token: req.params.token });
      });
    },

    change: function(req, res) {
      passwordReset.changePassword(req.body.token, req.body.password, function(err) {
        if (err) {
          res.render('account/password-change', { errors: [err] });
        } else {
          res.render('account/password-change', { success: 'Your password has been changed'});
        }
      });
    }
  };
};
