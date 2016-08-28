var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Package = new Schema({
  title: {
    type: String,
    required: true
  },
  city: {
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
    type: [String]
  },
  restaurants: {
    type: [String]
  },
  attractions: {
    type: [String]
  },
  flights: {
    type: Schema.Types.Mixed
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
    type: Number
  }
});

module.exports = mongoose.model('Package', Package);