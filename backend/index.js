const express = require('express')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const multer = require('multer')
const User = require('./model/userModel')
const app = express()

app.use(express.json())
app.use(cors())

// MongoDB
const dburl = 'mongodb://localhost:27017/Judspeccom'
mongoose
  .connect(dburl)
  .then(() => {
    console.log('Connect MongoDB')
  })
  .catch((err) => {
    console.log(err)
  })

// Authentication
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()
const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'judspeccomnaja@gmail.com',
        pass: 'xtrd fgod lmjw llwp',
      },
    })

    const mailOptions = {
      from: 'judspeccomnaja@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: 'Your OTP code is ' + otp,
    }
    let info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.response)
  } catch (error) {
    console.error('🔥 ERROR Sending OTP:', error)
  }
}

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })
    if (existUser) {
      if (existUser.username === username) {
        return res.status(400).json({ message: 'User already exist' })
      }
      if (existUser.email === email) {
        return res.status(400).json({ message: 'Email already exist' })
      }
    }
    // hash Password
    const hashPassword = await bcrypt.hash(password, 10)
    // create otp
    const otp = generateOTP()

    // new User
    const newUser = new User({ username, email, password: hashPassword, otp })
    await newUser.save()

    // send otp
    await sendOTP(email, otp)

    res.status(200).json({ message: 'Register success' })
  } catch (err) {
    res.status(500).json({ message: 'Error register user', err })
  }
})

//Verify
app.post('/verify', async (req, res) => {
  const { email, otp } = req.body
  try {
    const existEmail = await User.findOne({ email })

    if (!existEmail) return res.status(400).json({ message: 'Email not found' })

    if (existEmail.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' })

    // Update
    existEmail.isVerified = true
    existEmail.otp = null
    await existEmail.save()

    res.status(200).json({ message: 'OTP Verified Successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })

    if (!user) return res.status(400).json({ message: 'User Not Found' })

    if (!user.isVerified)
      return res.status(400).json({ message: 'You must be verify email' })

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Incorrect Password' })

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'secret_key',
      { expiresIn: '5h' }
    )

    res.status(200).json({
      message: 'Login Success',
      token,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Upload Image
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const uploads = multer({ storage })

app.post('/upload', uploads.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file upload' })

  const { email } = req.body
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { profileImage: imageUrl },
      { new: true }
    )

    if (!user) return res.status(404).json({ message: 'User Not Found' })

    res.status(200).json({ message: 'Image Uploaded', profileImage: imageUrl })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error })
  }
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Reset Password
app.post('/forgotPassword', async (req, res) => {
  const { email } = req.body
  try {
    const existEmail = await User.findOne({ email })

    if (!existEmail) return res.status(400).json({ message: 'Email Not Found' })

    const otp = generateOTP()
    await sendOTP(email, otp)

    await User.updateOne({ email: email }, { $set: { otp: otp } })

    res.status(200).json('Send OTP Success')
  } catch (error) {
    res.status(500).json({ message: 'SERVER ERROR', error })
  }
})

app.listen(5000, () => {
  console.log('Server is running')
})
