var express = require('express');
var router = express.Router();
var Package = require('../models/package');

/**
 * render package detail page
 */
router.get('/detail/:id', function(req, res, next) {
  var packageId = req.params.id || "";
  if (packageId) {
    Package
      .findById(packageId)
      .exec()
      .then(function (package) {
        console.log(package);
        res.render('front/package/detail', {package: package});
      })
      .catch(function(err) {
        res.status(404);
      })
  } else {
    res.status(404);
  }
});

/**
 * 线路GET请求
 * URL: /packages/package/:id
 * METHOD: GET
 */
router.get('/package/:id', function(req, res, next) {
  var packageId = req.params.id || "";
  if (packageId) {
    Package
      .findById(packageId)
      .exec()
      .then(function(package) {
        res.status(200).send(package);
      })
      .catch(function(err) {
        res.status(400).send(err);
      })
  } else {
    res.status(404).send('Not Found Package')
  }
});

/**
 * 线路页面POST请求: 添加或修改package对象
 * URL: /packages/package
 * METHOD: POST
 * PARAMS: id(修改时required)
 */
router.post('/package', function(req, res, next) {
  var packageId = req.query.id || "";
  // gather data from request
  var data = new Object();
  data['title'] = req.body.package_title;
  data['duration'] = req.body.package_duration;
  data['department'] = req.body.package_department;
  data['destination'] = req.body.package_destination.split(',').map(function(str) {return str.trim();});
  data['abstract'] = req.body.package_abstract;
  data['thumbnails'] = req.body['package_thumbnails'];
  data['hotels'] = req.body['hotels'];
  data['detail'] = req.body['schedules'];
  data['price'] = req.body.package_price;
  data['tags'] = req.body.package_tags.split(',').map(function(str){return str.trim();});
  data['inclusion'] = req.body['inclusion'];
  data['exclusion'] = req.body['exclusion'];

  if (packageId) {
    // update package
  } else {
    // create new package
    var package = new Package(data);
    package
      .save(function(result) {
        res.status(201).send(package);
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  }
});

/**
 * 线路列表GET请求
 */
router.get('/packages', function(req, res, next) {
  var start = parseInt(req.query.start) || 0;
  var limit = parseInt(req.query.limit) || 10;
  Package
    .find()
    .select('title _id')
    .skip(start*limit)
    .limit(limit)
    .exec()
    .then(function(packages) {
      var result = [];
      for (var i = 0; i < packages.length; i++) {
        var package = packages[i];
        result.push({
          'title': package.title,
          'link': '/packages/detail/' + package._id
        });
      }
      res.status(200).send(result);
    })
    .catch(function(err) {
      console.log(err);
      res.status(404).send('错误');
    })
});

module.exports = router;