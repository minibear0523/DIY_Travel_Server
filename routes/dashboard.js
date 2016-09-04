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
  var packageId = req.params.id || "";
  // gather data from request
  var data = new Object();
  data['title'] = req.body.package_title;
  data['city'] = req.body.package_city.split(',').map(function(str){return str.trim();});
  data['price'] = req.body.package_price;
  data['abstract'] = req.body.package_abstract;
  data['tags'] = req.body.package_tags.split(',').map(function(str){return str.trim();});
  data['thumbnails'] = req.body['package_thumbnails'];
  data['hotels'] = req.body['hotels'];
  data['detail'] = req.body['schedule'];
  data['inclusion'] = req.body['inclusion'];
  data['exclusion'] = req.body['exclusion'];

  console.log(data);
  res.status(200).send(data);

  // if (packageId) {
  //   // update package
  // } else {
  //   // create new package
  //
  // }
});

module.exports = router;