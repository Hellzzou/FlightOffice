const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password : { type: String, required: true },
  rank : {type: String, required: true},
  name: {type: String, required: true},
  responsability : { type: String, required: true },
  access: {type: Number, required: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('users', userSchema);