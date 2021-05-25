const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('areas', areaSchema);