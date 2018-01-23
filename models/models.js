const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: Number,
  in: Array,
  out: Array,
});

module.exports = {
  User: mongoose.model('User', userSchema),
};
