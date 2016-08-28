var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect();
});

router.post('/register', function(req, res, next) {
  Account.register(new Account({username: req.body.username}), req.body.password,
    function(err, user) {
    if (err) {
      console.log(err);
      res.render('404', {err: err});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect();
      });
    }
  })
});

module.exports = router;
