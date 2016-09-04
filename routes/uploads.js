var express = require('express');
var router = express.Router();
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var multer = require('multer');

var packageImagePath = path.join(__dirname, '..', 'uploads', 'package');

var packageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, packageImagePath);
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(err, err ? undefined: (raw.toString('hex') + path.extname(file.originalname)));
    });
  }
});

/**
 * 上传新图片
 */
router.post('/package', multer({
  storage: packageStorage,
  limits: {fieldSize: 5 * 1024 * 1024}}).single('thumbnail'),
  function(req, res, next) {
    var data = {
      url: '/package/' + req.file.filename,
      path: req.file.path,
      size: req.file.size,
      filename: req.file.filename,
      delete_url: '/uploads/package/' + req.file.filename,
      delete_tpye: 'DELETE'
    };
    res.status(201).send(data);
});

/**
 * 删除package的图片
 */
router.delete('/package/:filename', function(req, res, next) {
  var filename = req.params.filename;
  var filePath = path.join(packageImagePath, filename);
  fs.unlink(filePath, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send();
    }
  });
});

module.exports = router;