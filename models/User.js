// Load bcrypt module, used to hash the passwords
const bcrypt = require('bcrypt')
// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'UserSchema'
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// hash the passwords before saving
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
})
//
// Create the 'User' model out of the 'UserSchema'
module.exports = mongoose.model('User', UserSchema);