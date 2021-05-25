const mongoose = require('mongoose');

const normeSchema = mongoose.Schema({
  name: { type: String, required: true },
  hoursToDo: { type: Number, required: true },
  nightToDo: { type: Number, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model('normes', normeSchema);