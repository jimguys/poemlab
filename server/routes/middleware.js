var signedOutOnlyRoutes = ['/', '/login', '/register'];

function requestingSignedOutRoute(req) {
  return signedOutOnlyRoutes.indexOf(req.url) !== -1;
}

function requestingSignedInRoute(req) {
  return !requestingSignedOutRoute(req) && req.url !== '/login';
}

function signedIn(req) {
  return !!req.user;
}

function signedOut(req) {
  return !signedIn(req);
}

module.exports = {
  redirectBasedOnLoggedInStatus: function(req, res, next) {
    if (signedIn(req) && requestingSignedOutRoute(req)) {
      res.redirect('/poems');
    } else if (signedOut(req) && requestingSignedInRoute(req)) {
      res.redirect('/');
    } else {
      next();
    }
  }
};
