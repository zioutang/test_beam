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

// const docSchema = new Schema({
//   content: {
//     type: Array
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   owner: {
//     type: Schema.ObjectId,
//     ref: 'User',
//     required: true
//   }
// });
// Make the owner title combination unique
// docSchema.index({
//   owner: 1,
//   title: 1
// }, {
//   unique: true
// });

module.exports = {
  User: mongoose.model('User', userSchema),
  // Doc: mongoose.model('Doc', docSchema)
};
