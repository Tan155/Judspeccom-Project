const express = require('express')
const router = express.Router()
const UserBuild = require('../model/UserBuild')
const User = require('../model/userModel')
const mongoose = require('mongoose')

// POST: Create User Build
router.post('/user-builds', async (req, res) => {
  try {
    const { userEmail, selectedParts } = req.body

    console.log('📌 selectedParts:', selectedParts)

    const userExists = await User.findOne({ email: userEmail })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)
    let validParts = {}

    for (const key in selectedParts) {
      if (selectedParts[key]) {
        if (!isValidObjectId(selectedParts[key])) {
          return res.status(400).json({
            error: `${key} (${selectedParts[key]}) is not a valid ObjectId`,
          })
        }
        validParts[key] = selectedParts[key]
      }
    }

    const newUserBuild = new UserBuild({
      userEmail,
      selectedParts: {
        cpuId: selectedParts[0],
        mainboardId: selectedParts[1],
        gpuId: selectedParts[2],
        ramId: selectedParts[3],
        m2Id: selectedParts[4],
        psuId: selectedParts[5],
        caseId: selectedParts[6],
      },
    })

    await newUserBuild.save()
    res.status(201).json({ message: 'User build created', data: newUserBuild })
  } catch (error) {
    console.error('❌ Error creating user build:', error)
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message })
  }
})

router.get('/user-builds', async (req, res) => {
  try {
    const { userEmail } = req.query
    console.log('📌 Fetching user builds for email:', userEmail)

    const userBuilds = await UserBuild.find({ userEmail })

    if (userBuilds.length === 0) {
      return res
        .status(404)
        .json({ error: 'No user builds found for this email' })
    }

    res.status(200).json({ message: 'User builds found', data: userBuilds })
  } catch (error) {
    console.error('❌ Error fetching user builds:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.delete('/delete-build/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedBuild = await UserBuild.findByIdAndDelete(id)

    if (!deletedBuild) {
      return res.status(404).json({ error: 'Build not found' })
    }

    res
      .status(200)
      .json({ message: 'Build deleted successfully', data: deletedBuild })
  } catch (error) {
    console.error('❌ Error deleting user build:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
