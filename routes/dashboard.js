var express = require('express');
var router = express.Router();
var Package = require('../models/package');


router.get('/', function(req, res, next) {
  res.render('dashboard/layout');
});

/**
 * 线路页面GET请求
 */
router.get('/package', function(req, res, next) {
  res.render('dashboard/package');
});

module.exports = router;