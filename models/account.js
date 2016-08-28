/**
 * Created by MiniBear0523 on 8/22/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);