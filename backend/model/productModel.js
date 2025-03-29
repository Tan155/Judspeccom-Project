const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true }, // convert string to number.
  additionalDetails: {
    Brand: { type: String, default: 'Unknown' },
    Model: { type: String, required: true },
    FormFactor: { type: String, required: true },
    MainboardSupport: { type: String, required: true },
    VGASupport: { type: String, required: true },
    Color: { type: String, required: true },
    CPUCoolerSupport: { type: String, required: true },
    PowerSupplySupport: { type: String, required: true },
    FrontIO: { type: String, default: 'Unknown' },
    ExpansionSlots: { type: String, required: true },
    DriveBaysSupport: { type: String, required: true },
    FanInstallment: { type: String, default: 'Unknown' },
    FanSupportFront: { type: String, default: 'Unknown' },
    FanSupportTop: { type: String, default: 'Unknown' },
    FanSupportSide: { type: String, default: 'Unknown' },
    FanSupportRear: { type: String, default: 'Unknown' },
    FanSupportBottom: { type: String, default: 'Unknown' },
    MAXRadiatorSupport: { type: String, default: 'Unknown' },
    RadiatorSupportFront: { type: String, default: 'Unknown' },
    RadiatorSupportTop: { type: String, default: 'Unknown' },
    RadiatorSupportSide: { type: String, default: 'Unknown' },
    RadiatorSupportRear: { type: String, default: 'Unknown' },
    RadiatorSupportBottom: { type: String, default: 'Unknown' },
    Accessories: { type: String, default: 'Unknown' },
    DimensionsWxDxH: { type: String, default: 'Unknown' },
    Weight: { type: String, default: 'Unknown' },
    Warranty: { type: String, required: true },
  },
})

const cpuSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true },
  additionalDetails: {
    Brand: {
      type: String,
      enum: ['intel', 'amd'], // ✅ รองรับเฉพาะ intel / amd
      required: true,
      set: (v) => v.toLowerCase(), // ✅ แปลงให้เป็นตัวพิมพ์เล็กก่อนบันทึก
    },
    Series: { type: String, required: true },
    ProcessorNumber: { type: String, required: true },
    SocketType: { type: String, required: true },
    Cores: { type: Number, required: true },
    Threads: { type: Number, required: true },
    BaseFrequency: { type: Number, required: true },
    MaxTurboFrequency: { type: Number, required: true },
    L2Cache: { type: Number, required: true },
    L3Cache: { type: Number, required: true },
    GraphicsModels: { type: String, default: 'N/A' }, // ✅ ป้องกันค่า null
    Bit64Support: { type: String, default: 'N/A' },
    CPUCooler: { type: String, default: 'Yes' },
    MaximumTurboPower: { type: String, default: 'N/A' }, // ✅ ป้องกันค่า null
    Warranty: { type: String, required: true },
  },
})

const gpuSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true }, // ✅ แปลงราคาเป็นตัวเลข
  additionalDetails: {
    Brands: { type: String, required: true },
    GPUSeries: { type: String, required: true },
    GPUModel: { type: String, required: true },
    MemorySize: { type: String, required: true },
    MemoryType: { type: String, default: 'GDDR6' }, // ✅ ถ้าไม่มีค่าให้ใช้ GDDR6
    BusStandard: { type: String, required: true },
    CUDA_Cores: { type: Number, required: true }, // ✅ เปลี่ยนจาก "CUDA®Cores" เป็นตัวเลข
    MemoryInterface: { type: String, required: true },
    BoostClock: { type: String, required: true },
    BaseClock: { type: String, default: 'N/A' }, // ✅ ถ้าไม่มี BaseClock ใส่ "N/A"
    MemoryClock: { type: String, required: true },
    MaxDigitalResolution: { type: String, default: 'Unknown' },
    HDMIPort: { type: String, required: true },
    DisplayPort: { type: String, required: true },
    CoolerFan: { type: String, default: 'Unknown' },
    PowerConnector: { type: String, default: 'N/A' }, // ✅ ถ้าไม่มีค่า ใส่ "N/A"
    PowerRequirement: { type: String, required: true },
    Dimension: { type: String, required: true },
    Warranty: { type: String, required: true },
  },
})

const m2Schema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true }, // ✅ แปลงราคาเป็นตัวเลข
  additionalDetails: {
    Brand: { type: String, default: 'Unknown' }, // ✅ บางตัวไม่มี Brand
    FormFactor: { type: String, required: true },
    Capacity: { type: String, required: true },
    Interface: { type: String, required: true },
    ReadSpeed: { type: String, default: 'Unknown' }, // ✅ ป้องกัน undefined
    WriteSpeed: { type: String, default: 'Unknown' }, // ✅ ป้องกัน undefined
    Warranty: { type: String, required: true },
  },
})

const mainboardSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true },
  additionalDetails: {
    Brands: { type: String, required: true },
    CPUSupport: { type: String, default: 'Unknown' },
    CPUSocket: { type: String, required: true },
    Chipset: { type: String, required: true },
    MemorySlots: { type: String, required: true },
    MemoryType: { type: String, required: true },
    MaxMemory: { type: String, required: true },
    OnboardGraphics: { type: String, required: true },
    OnboardAudioChipset: { type: String, required: true },
    AudioChannels: { type: String, required: true },
    ExpansionSlots: { type: String, required: true },
    Storage: { type: String, required: true },
    RearPanelIO: { type: String, required: true },
    LANChipset: { type: String, required: true },
    LANSpeed: { type: String, required: true },
    Dimensions: { type: String, required: true },
    PowerPin: { type: String, required: true },
    FormFactor: {
      type: String,
      enum: ['ATX', 'Micro-ATX', 'Mini-ITX'], // ✅ รองรับเฉพาะรูปแบบที่ถูกต้อง
      required: true,
      set: (v) => {
        const normalized = v.trim().replace(/-/g, '').toLowerCase() // ✅ ลบ "-" และแปลงเป็นพิมพ์เล็ก
        if (normalized === 'microatx') return 'Micro-ATX' // ✅ แปลงให้เป็นค่าที่ถูกต้อง
        if (normalized === 'miniitx') return 'Mini-ITX'
        return v
      },
    },
    Warranty: { type: String, required: true },
  },
})

const psuSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true }, // ✅ แปลงราคาเป็นตัวเลข
  additionalDetails: {
    Brand: { type: String, required: true },
    EnergyEfficient: { type: String, default: 'Unknown' },
    Modular: { type: String, default: 'Non Modular' }, // ✅ ป้องกัน undefined
    ContinuousPowerW: { type: String, required: true },
    FormFactor: { type: String, default: 'ATX' }, // ✅ ป้องกัน undefined
    InputVoltage: { type: String, default: 'Unknown' },
    InputCurrent: { type: String, default: 'Unknown' },
    InputFrequency: { type: String, default: 'Unknown' },
    MBConnector: { type: String, required: true },
    CPUConnector: { type: String, required: true },
    PCIeConnector: { type: String, required: true },
    SATAConnector: { type: String, required: true },
    FanSize: { type: String, default: '120 mm' },
    Dimensions: { type: String, default: 'Unknown' },
    Protections: { type: String, default: 'Unknown' },
    Warranty: { type: String, required: true },
  },
})

const ramSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  price: { type: Number, required: true }, // ✅ แปลงราคาเป็นตัวเลข
  additionalDetails: {
    Brand: { type: String, required: true },
    MemorySeries: { type: String, required: true },
    MemoryCapacity: { type: String, required: true },
    Speed: { type: String, default: 'Unknown' }, // ✅ ถ้าไม่มีค่าให้ใช้ "Unknown"
    MemoryType: { type: String, required: true },
    CasLatency: { type: String, default: 'Unknown' }, // ✅ ป้องกัน undefined
    TestedLatency: { type: String, default: 'Unknown' }, // ✅ ป้องกัน undefined
    SPDVoltage: { type: String, default: 'Unknown' }, // ✅ ป้องกัน undefined
    MemoryColor: { type: String, required: true },
    Warranty: { type: String, required: true },
  },
})

const Mainboard = mongoose.model('Mainboard', mainboardSchema)
const M2 = mongoose.model('M2', m2Schema)
const Case = mongoose.model('Case', caseSchema)
const CPU = mongoose.model('CPU', cpuSchema)
const GPU = mongoose.model('GPU', gpuSchema)
const PSU = mongoose.model('PSU', psuSchema)
const RAM = mongoose.model('RAM', ramSchema)

module.exports = { CPU, Mainboard, GPU, Case, M2, PSU, RAM }
