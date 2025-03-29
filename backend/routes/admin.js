const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const User = require('../model/userModel')
const {
  CPU,
  Mainboard,
  GPU,
  Case,
  M2,
  PSU,
  RAM,
} = require('../model/productModel')
const { error } = require('console')
const router = express.Router()

// Extract All User Data
router.post('/allUser', async (req, res) => {
  try {
    const users = await User.find({ status: 'Customer' }, 'username email')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' })
  }
})

router.delete('/deleteUser', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Not found' })
    const response = await User.findOneAndDelete({ email })
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' })
  }
})

router.delete('/deleteProduct', async (req, res) => {
  try {
    const { id, category } = req.body
    console.log(id, category)
    if (!id || !category) {
      return res.status(400).json({ error: 'Missing id or category' })
    }

    let productModel

    switch (category.toLowerCase()) {
      case 'cpu':
        productModel = CPU
        break
      case 'mainboard':
        productModel = Mainboard
        break
      case 'gpu':
        productModel = GPU
        break
      case 'ram':
        productModel = RAM
        break
      case 'psu':
        productModel = PSU
        break
      case 'm2':
        productModel = M2
        break
      case 'case':
        productModel = Case
        break
      default:
        return res.status(400).json({ error: 'Invalid category' })
    }

    const deletedProduct = await productModel.findByIdAndDelete(id)

    console.log('Product to be deleted:', deletedProduct)

    if (!deletedProduct)
      return res.status(404).json({ error: 'Product not found' })

    res.json({ message: 'Product deleted successfully', deletedProduct })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error deleting product', details: error.message })
  }
})

router.post('/addProducts', async (req, res) => {
  try {
    const { category, productData } = req.body
    let productModel
    switch (category.toLowerCase()) {
      case 'cpu':
        productModel = CPU
        break
      case 'gpu':
        productModel = GPU
        break
      case 'ram':
        productModel = RAM
        break
      case 'mainboard':
        productModel = Mainboard
        break
      case 'psu':
        productModel = PSU
        break
      case 'case':
        productModel = Case
        break
      case 'm2':
        productModel = M2
        break
      default:
        return res.status(400).json({ error: 'Invalid category' })
    }

    if (!productModel) {
      return res
        .status(400)
        .json({ message: 'Failed to determine product model' })
    }

    const existingProduct = await productModel.findOne({
      name: productData.name,
    })

    if (existingProduct) {
      return res.status(400).json({ message: 'Product name already exists' })
    }

    const newProduct = new productModel(productData)
    await newProduct.save()
    res
      .status(200)
      .json({ message: 'Product added successfully', product: newProduct })
  } catch (error) {
    console.error('Error adding GPU product:', error.message)
    res
      .status(500)
      .json({ error: 'Error adding product', details: error.message })
  }
})
module.exports = router
