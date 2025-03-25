const mongoose = require('mongoose')

let UserSchma = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  status: {
    type: String,
    default: 'Customer',
  },
  profileImage: {
    type: String,
    default: 'https://cdn.vuetifyjs.com/images/john.png',
  },
})

const User = mongoose.model('users', UserSchma)

module.exports = User
