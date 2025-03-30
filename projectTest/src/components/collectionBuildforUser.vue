<template>
  <v-container class="Container">
    <v-card v-for="(item, index) in arrProduct" :key="index" class="Card">
      <v-row>
        <v-col cols="4">
          <h1 style="font-size: 24px;">
            Collection {{ index + 1 }}
          </h1>
          <!-- <p>ID: {{ item.id }}</p> -->
        </v-col>
        <v-col cols="4" />
        <v-col cols="3">
          <v-row>
            <v-col cols="12">
              <v-btn color="#607D8B" block @click="() => { swapDialog(); setisSelectedCollection(index); }">
                information
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="#66BB6A" style="margin-top: 10px;" block @click="goDownloadPDF(item)">
                Download
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row style="transform: translateY(-20%) translateX(2%);">
        <v-col cols="1">
          <v-img :src="item.Cpu.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.Gpu.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.Mainboard.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.Ram.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.Psu.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.M2.img" width="100px" />
        </v-col>
        <v-col cols="1">
          <v-img :src="item.Case.img" width="100px" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <v-dialog v-model="isdialog" scrollable :overlay="false" width="800px" transition="dialog-transition">
    <v-container style="overflow-y: auto; display: flex; flex-direction: row; background-color: black;" width="auto">
      <v-row>
        <v-col v-for="(item, index) in arrProduct[getisSelectedCollection()]" :key="index" cols="12">
          <v-card width="100%">
            <v-row>
              <v-col cols="4">
                <v-img :src="item.img" style="width: 100%; height: 100%;" />
              </v-col>
              <v-col cols="8">
                <v-row>
                  <v-col cols="12">
                    <p style="font-size: 24px; font-weight: bold;">
                      {{ Utility.cleanNameItem(item.name) }}
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <p style="font-size: 28px; font-weight: bold;">
                      {{ Utility.formatPrice(item.price) }}
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-btn v-if="getisdisplayInfo(index)" block color="success" @click="setisdisplayInfo(index)">
                      Hide
                    </v-btn>
                    <v-btn v-else block color="success" @click="setisdisplayInfo(index)">
                      Show additionalDetails
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="getisdisplayInfo(index)">
              <v-col cols="12">
                <v-sheet color="#E3F2FD" class="pa-4" style="height: auto; text-align: start;">
                  <table width="100%">
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Spec</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(value, key) in item.additionalDetails" :key="key">
                        <td>{{ key }}</td>
                        <td>{{ value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script setup>
import authService from "@/services/AuthService";
import { useUtility } from "@/stores/Utility";
import { useProductStore } from "@/stores/ProductStore";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import sarabunFont from "@/assets/fonts/Sarabun-SemiBold.js";

//Init Service
const router = useRouter();
const useProduct = useProductStore();
const Utility = useUtility();

//Event
onMounted(async () => {
  await loadUserFromServer();
  await fetchUserBuild(email.value);
});

//Product
const BuildCollection = ref([]);
//fetch
const fetchUserBuild = async (email) => {
  try {

    const response = await axios.get(
      `http://localhost:5000/api/setcomputer/user-builds?userEmail=${encodeURIComponent(email)}`
    );

    // console.log("Response : ", response);
    // console.log("Response data: ", response.data);
    // console.log("Response data.data: ", response.data.data);

    BuildCollection.value = response.data.data.map(item => {
      return {
        selectedParts: item.selectedParts,
        userEmail: item.userEmail,
        createdAt: item.createdAt,
        id: item._id,
      };
    });

    // console.log('User build data:', BuildCollection.value);
    // console.log(BuildCollection.value[0].selectedParts.caseId);
  } catch (err) {
    console.error('Error fetching user build:', err.message);
  }

  if (BuildCollection.value && BuildCollection.value.length > 0) {
    for (let i = 0; i < BuildCollection.value.length; i++) {
      getProduct(i);
      console.log(arrProduct.value[i].Cpu ?? 'N/A')
    }
  } else {
    console.log('BuildCollection is not loaded yet');
  }
};

const arrProduct = ref([]);

function getProduct(index) {
  if (BuildCollection.value[index] && BuildCollection.value[index].selectedParts) {
    const cpuId = BuildCollection.value[index].selectedParts.cpuId;
    const gpuId = BuildCollection.value[index].selectedParts.gpuId;
    const mainboardId = BuildCollection.value[index].selectedParts.mainboardId;
    const ramId = BuildCollection.value[index].selectedParts.ramId;
    const psuId = BuildCollection.value[index].selectedParts.psuId;
    const m2Id = BuildCollection.value[index].selectedParts.m2Id;
    const caseId = BuildCollection.value[index].selectedParts.caseId;

    if (Array.isArray(useProduct.allProducts[0])) {
      const matchedCPU = useProduct.allProducts[0].find(product => product._id === cpuId);
      const matchedGPU = useProduct.allProducts[1].find(product => product._id === gpuId);
      const matchedMAINBOARD = useProduct.allProducts[2].find(product => product._id === mainboardId);
      const matchedRAM = useProduct.allProducts[3].find(product => product._id === ramId);
      const matchedPSU = useProduct.allProducts[4].find(product => product._id === psuId);
      const matchedM2 = useProduct.allProducts[5].find(product => product._id === m2Id);
      const matchedCASE = useProduct.allProducts[6].find(product => product._id === caseId);
      arrProduct.value.push({
        Cpu: matchedCPU,
        Gpu: matchedGPU,
        Mainboard: matchedMAINBOARD,
        Ram: matchedRAM,
        Psu: matchedPSU,
        M2: matchedM2,
        Case: matchedCASE,
      });
      // console.log("Matched product: ", arrProduct.value);
      // console.log("CaseId from selectedParts: ", cpuId);
      // console.log("Product _id: ", useProduct.allProducts[0].map(product => product._id));

    } else {
      console.log("allProducts[0] is not an array.");
    }
  } else {
    console.log("Selected parts or BuildCollection[index] is undefined.");
  }
}

//AuthService
const email = ref("");
const status = ref("")

const loadUserFromServer = async () => {
  try {
    const user = await authService.loadUserFromServer();
    if (user) {
      email.value = user.email;
      status.value = user.status;
    }
  } catch (error) {
    alert("Please Login again");
    console.error("Expire Session", error)
    router.push("/");
  }
};

//Dialog
const isdialog = ref(false);
function swapDialog() {
  isdialog.value = !isdialog.value;
}

const isSelectedCollection = ref(0);

function setisSelectedCollection(index) {
  if (index < 0 || index >= arrProduct.value.length) {
    console.error("index < 0 || index >= arrProduct.value.length");
    return;
  }
  isSelectedCollection.value = index;
  console.log(`isSelectedCollection.value : ${isSelectedCollection.value}`);
}

function getisSelectedCollection() {
  return isSelectedCollection.value;
}

//Info
let isdisplayInfo = ref(Array.from({ length: arrProduct.value.length }, () => false));

function setisdisplayInfo(index) {
  isdisplayInfo.value[index] = !isdisplayInfo.value[index];

  //binary
  // let left = 0;
  // let right = arrProduct.value.length - 1;

  // while (right >= left) {
  //   if (left !== index) {
  //     isdisplayInfo.value[left] = false;
  //   }
  //   if (right !== index) {
  //     isdisplayInfo.value[right] = false;
  //   }
  //   left++;
  //   right--;
  // }
}

function getisdisplayInfo(index) {
  console.log("isdisplayInfo[index]", isdisplayInfo.value[index]);
  return isdisplayInfo.value[index] ?? false;
}

watch(() => arrProduct.value.length, (newLength) => {
  isdisplayInfo.value = Array.from({ length: newLength }, () => false);
});

//Pre PDF
const stack = ref([]);

watch(() => arrProduct.value, (newVal) => {
  if (newVal.length > 0) {
    const keys = ["Cpu", "Mainboard", "Gpu", "Ram", "Psu", "M2", "Case"];
    stack.value = keys.map(() => ({
      object: [],
      values: 1,
    }));
  }
}, { immediate: true, deep: true });

function goDownloadPDF(object) {
  if (!object) return;

  stack.value[0].object = object?.Cpu || {};
  stack.value[1].object = object?.Mainboard || {};
  stack.value[2].object = object?.Gpu || {};
  stack.value[3].object = object?.Ram || {};
  stack.value[4].object = object?.Psu || {};
  stack.value[5].object = object?.M2 || {};
  stack.value[6].object = object?.Case || {};

  console.table(stack.value);
  generatePDF();
}


watch(() => arrProduct.value, (newArrProduct) => {
  if (newArrProduct.length > 0) {
    console.log("arrProduct is ready for PDF generation");
  }

}, { immediate: true });

//PDF Generator
class ModelPDF {
  constructor() {
    //MODEL
    this.CPU = [];
    this.MB = [];
    this.GPU = [];
    this.RAM = [];
    this.M2 = [];
    this.PSU = [];
    this.CASE = [];

  }

  getCPUData() {
    const details = stack.value[0]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }

    const keysToKeep = ["Cores", "BaseFrequency", "MaximumTurboPower", "SocketType", "GraphicsModels", "Warranty"];

    this.CPU = Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );

    return this.CPU;
  }

  getMBData() {
    const details = stack.value[1]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "CPUSocket",
      "Chipset",
      "MemorySlots",
      "MemoryType",
      "MaxMemory",
      "ExpansionSlots",
      "Storage",
      "RearPanelIO",
      "PowerPin",
      "FormFactor",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }

  getGPUData() {
    const details = stack.value[2]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "GPUModel",
      "MemorySize",
      "BusStandard",
      "BoostClock",
      "HDMIPort",
      "DisplayPort",
      "PowerRequirement",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }

  getRAMData() {
    const details = stack.value[3]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "MemoryCapacity",
      "Speed",
      "MemoryType",
      "CasLatency",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }

  getM2Data() {
    const details = stack.value[4]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "Capacity",
      "Interface",
      "ReadSpeed",
      "WriteSpeed",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }

  getPSUData() {
    const details = stack.value[5]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "EnergyEfficient",
      "Modular",
      "ContinuousPowerW",
      "MBConnector",
      "PCIeConnector",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }

  getCaseData() {
    const details = stack.value[6]?.object?.additionalDetails;
    if (!details) {
      console.log("Error: Object details not found");
      return {};
    }
    const keysToKeep = [
      "Model",
      "FormFactor",
      "MainboardSupport",
      "VGASupport",
      "PowerSupplySupport",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter((value) => value !== undefined)
    );
  }
};

const dataPDF = new ModelPDF();

const formatDetails = (details) => {
  if (!details || typeof details !== "object") return "N/A";
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

const getFormattedDetails = (index) => {
  switch (index) {
    case 0: return formatDetails(dataPDF.getCPUData());
    case 1: return formatDetails(dataPDF.getMBData());
    case 2: return formatDetails(dataPDF.getGPUData());
    case 3: return formatDetails(dataPDF.getRAMData());
    case 4: return formatDetails(dataPDF.getM2Data());
    case 5: return formatDetails(dataPDF.getPSUData());
    case 6: return formatDetails(dataPDF.getCaseData());
    default: return "N/A";
  }
};

const generatePDF = async () => {

  if (!confirm("Download PDF?")) return;
  const doc = new jsPDF();

  doc.addFileToVFS("Sarabun-SemiBold.ttf", sarabunFont);
  doc.addFont("Sarabun-SemiBold.ttf", "Sarabun", "bold");
  doc.setFont("Sarabun");

  doc.text("Computer Build List", 16, 10);

  const columns = ["No", "Name", "Details", "Amount", "Price"];

  const totalPrice = stack.value
    .reduce((sum, item) => sum + (item.object.price * item.values), 0);

  const rows = stack.value
    .map((item, index) => [
      index + 1,
      Utility.cleanNameItem(item?.object?.name || "N/A"),
      getFormattedDetails(index),
      item.values,
      `${Utility.formatPrice2(item.object.price)}`,
    ]);




  rows.push([
    { content: "Total", colSpan: 4, styles: { halign: "right", fontStyle: "bold" } },
    `${Utility.formatPrice2(totalPrice)}`,
  ]);

  rows.push([
    { content: `ราคาสุทธิ`, colSpan: 3, styles: { halign: `right`, fontSize: 14, fontStyle: `bold` } },
    `${Utility.formatPrice2(totalPrice)}`, `บาทถ้วน`
  ]);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 20,
    theme: "grid",

    headStyles: {
      fillColor: [199, 199, 199], // สีเขียว
      textColor: [255, 255, 255], // สีขาว
      fontSize: 14,
      fontStyle: "bold",
    },

    bodyStyles: {
      font: `Sarabun`,
      fontSize: 10,
      textColor: [0, 0, 0],
    },

    columnStyles: {
      0: { fontSize: 12, fontStyle: "bold" },
      1: { fontSize: 10, fontStyle: "bold" },
      2: { fontSize: 10 },
      3: { fontSize: 12 },
      4: { fontSize: 12, fontStyle: "bold" },
    },

    alternateRowStyles: {
      fillColor: [240, 240, 240], // สีเทาอ่อน
    },

    styles: {
      fontSize: 10,
      textColor: [0, 0, 0], // สีดำ
    },
  });

  doc.save(`ComputerBuildList-${Date.now()}.pdf`);
};


</script>

<style lang="scss" scoped>
.Container {
  transform: translateX(-15%) translateY(-10%);
  width: 100%;
  min-height: 400px;
  // background-color: #82B1FF;
  overflow-y: auto;
}

.Card {
  margin-top: 20px;
  width: 100%;
  // height: 300px;
  background-color: #282b2c;
  padding: 2px;
}
</style>
