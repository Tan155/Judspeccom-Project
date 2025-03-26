const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

// import
const User = require('./model/userModel')
const Product = require('./model/productModel')
const UserBuild = require('./model/UserBuild')
const Admin = require('./model/adminModel')

const routerUser = require('./routes/user')
const routerProduct = require('./routes/products')
const routerAdmin = require('./routes/admin')

const routerSetComputer = require('./routes/setComputer')

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cookieParser())
app.use(express.json())

app.use(cors(corsOptions))

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

app.use('/api/setcomputer', routerSetComputer)
app.use('/api/admin', routerAdmin)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(5000, () => {
  console.log('Server is running')
})
