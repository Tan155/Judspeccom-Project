const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./userModel')

const Admin = async () => {
  username = 'Admin123'
  const password = 'Admin123456'
  const email = 'admin@gmail.com'
  const user = await User.findOne({ username })
  if (user) {
    return
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const newAdmin = User({
    username,
    email,
    password: hashPassword,
    isVerified: true,
    otp: null,
    status: 'Admin',
  })
  await newAdmin.save()
}

Admin()
