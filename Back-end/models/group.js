const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  group: { type: Number, required: true },
  underGroup: { type: String, required: true },
  mission: {type: String, required: true },
  context:[{type:String, required: false}],
  client: { type: String, required: true },
  manager: { type: String, required: true },
  allocation: { type: Number, required: true }
});

module.exports = mongoose.model('groups', groupSchema);