const mongoose = require('mongoose');

const simpilSchema = mongoose.Schema({
  date: { type: Date, required: true },
  mission: { type: String, required: true },
  totalDuration: { type: Number, required: true },
  nightDuration: { type: Number, required: true },
  nightDuration: { type: Number, required: true },
  pilots:[{
    name: { type: String, required: true },
    total: { type: Number, required: true },
    night: { type: Number, required: true },
  }]
});

module.exports = mongoose.model('simpils', simpilSchema);