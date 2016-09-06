var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Package = new Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  destination: {
    type: [String],
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String]
  },
  hotels: {
    type: [Schema.Types.Mixed]
  },
  detail: {
    type: [Schema.Types.Mixed]
  },
  price: {
    type: Number
  },
  tags: {
    type: [String]
  },
  inclusion: {
    type: [String]
  },
  exclusion: {
    type: [String]
  },
  pv: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Package', Package);