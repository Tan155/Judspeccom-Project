const express = require('express')
const {
  CPU,
  Mainboard,
  GPU,
  Case,
  M2,
  PSU,
  RAM,
} = require('../model/productModel')

const router = express.Router()

// ✅ GET All Products (รวมสินค้าทุกประเภท)
router.get('/', async (req, res) => {
  try {
    const cpus = await CPU.find()
    const mainboards = await Mainboard.find()
    const gpus = await GPU.find()
    const rams = await RAM.find()
    const psus = await PSU.find()
    const m2s = await M2.find()
    const cases = await Case.find()

    // รวมสินค้าทั้งหมดใน JSON
    const products = {
      cpu: cpus,
      mainboard: mainboards,
      gpu: gpus,
      ram: rams,
      psu: psus,
      m2: m2s,
      case: cases,
    }

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET CPU List
router.get('/cpu', async (req, res) => {
  try {
    const cpus = await CPU.find()
    res.json(cpus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET Mainboard List
router.get('/mainboard', async (req, res) => {
  try {
    const mainboards = await Mainboard.find()
    res.json(mainboards)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET GPU List
router.get('/gpu', async (req, res) => {
  try {
    const gpus = await GPU.find()
    res.json(gpus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET RAM List
router.get('/ram', async (req, res) => {
  try {
    const rams = await RAM.find()
    res.json(rams)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET PSU List
router.get('/psu', async (req, res) => {
  try {
    const psus = await PSU.find()
    res.json(psus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET M.2 Storage List
router.get('/m2', async (req, res) => {
  try {
    const m2s = await M2.find()
    res.json(m2s)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ GET Case List
router.get('/case', async (req, res) => {
  try {
    const cases = await Case.find()
    res.json(cases)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
