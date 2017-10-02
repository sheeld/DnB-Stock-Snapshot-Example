/* INCLUDES */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* SNAPSHOT SCHEMA */
const SnapshotSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  ticker: String,
  data: Object,
  testdata: Object,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Snapshot', SnapshotSchema);
