const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

// import
const User = require('./model/userModel')
const Product = require('./model/productModel')

const routerUser = require('./routes/user')
const routerProduct = require('./routes/products')

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

app.use('/api/user', routerUser)
app.use('/api/products', routerProduct)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(5000, () => {
  console.log('Server is running')
})
