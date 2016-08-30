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

/**
 * 线路页面POST请求: 添加或修改package对象
 * URL: /package
 * METHOD: POST
 * PARAMS: id(修改时required)
 */
router.post('/package', function(req, res, next) {

});

module.exports = router;