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

router.get('/ram', async (req, res) => {
  try {
    const rams = await RAM.find()
    res.json(rams)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/psu', async (req, res) => {
  try {
    const psus = await PSU.find()
    res.json(psus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/m2', async (req, res) => {
  try {
    const m2s = await M2.find()
    res.json(m2s)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/case', async (req, res) => {
  try {
    const cases = await Case.find()
    res.json(cases)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
