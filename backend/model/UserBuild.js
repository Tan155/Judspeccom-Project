const mongoose = require('mongoose')

const userBuildSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, ref: 'User' },

  selectedParts: {
    caseId: { type: String, default: null }, // ✅ เปลี่ยนจาก ObjectId เป็น String
    cpuId: { type: String, default: null },
    gpuId: { type: String, default: null },
    ramId: { type: String, default: null },
    m2Id: { type: String, default: null },
    mainboardId: { type: String, default: null },
    psuId: { type: String, default: null },
  },

  createdAt: { type: Date, default: Date.now },
})

const UserBuild = mongoose.model('UserBuild', userBuildSchema)
module.exports = UserBuild
