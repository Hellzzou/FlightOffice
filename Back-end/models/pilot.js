const mongoose = require('mongoose');

const pilotSchema = mongoose.Schema({
  name: { type: String, required: true },
  norme: { type: String, required: true },
  belonging: { type: String, required: true },
  crew: { type: String, required: true },
});

module.exports = mongoose.model('pilots', pilotSchema);