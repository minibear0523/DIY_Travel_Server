var express = require('express');
var router = express.Router();
var Package = require('../models/package');

router.get('/detail', function(req, res, next) {
  res.render('front/package/detail');
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

  if (packageId) {
    // update package
  } else {
    // create new package
    var package = new Package(data);
    package
      .save(function(package) {
        res.status(201).send(package);
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  }
});

module.exports = router;