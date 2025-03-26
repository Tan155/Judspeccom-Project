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

router.get('/user-builds/:email/details', async (req, res) => {
  try {
    const userBuild = await UserBuild.findOne({ userEmail: req.params.email })

    if (!userBuild) {
      return res.status(404).json({ error: 'User build not found' })
    }

    // ✅ กรองเฉพาะ selectedParts ที่มีค่า ไม่เอา null
    const filteredParts = Object.fromEntries(
      Object.entries(userBuild.selectedParts).filter(
        ([key, value]) => value !== null
      )
    )

    res
      .status(200)
      .json({ userEmail: userBuild.userEmail, selectedParts: filteredParts })
  } catch (error) {
    console.error('❌ Error fetching user build details:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
