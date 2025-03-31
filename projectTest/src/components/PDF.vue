<template>
  <v-btn class="pdf" @click="usePrintPDF">
    Download PDF
  </v-btn>

  <v-snackbar v-model="snackbar" :timeout="3000">
    PDF Exported Successfully!
  </v-snackbar>

  <v-container class="mb-10">
    <template v-if="page === 'cart'">
      <v-dialog v-model="dialog" :overlay="false" width="600px" transition="dialog-transition">
        <v-container class="bg-indigo-accent-1 pageCart">
          <v-row>
            <h2>My Cart</h2>
          </v-row>
          <v-row>
            <v-col cols="1">
              No.
            </v-col>
            <v-col cols="1">
              img
            </v-col>
            <v-col cols="4">
              Name
            </v-col>
            <v-col cols="2">
              Price
            </v-col>
            <v-col cols="3">
              Value
            </v-col>
          </v-row>
          <v-row v-for="(item, index) in drawer?.getStack()" :key="index">
            <v-container v-if="item?.status === 1" class="rowItemCart">
              <v-row>
                <v-col cols="1">
                  {{ index }}
                </v-col>
                <v-col cols="1">
                  <v-img :src="item?.img" max-width="30px" />
                </v-col>
                <v-col cols="4">
                  <p style="font-size: 12px;">
                    {{ item?.name }}
                  </p>
                </v-col>
                <v-col cols="2">
                  <p style="font-size: 14px;">
                    {{ item?.price.toFixed(2) }} ฿
                  </p>
                </v-col>
                <v-col cols="3">
                  <v-container>
                    <v-row style="transform: translateY(-10px);">
                      <v-col cols="4">
                        <button v-if="drawer.getStackAt(index).values > 1" class="circle" style="background-color: red;"
                          @click="drawer?.updateStackValues('pop', index)">
                          <h2>-</h2>
                        </button>
                        <button v-else class="circle" style="background-color: gray;" disabled>
                          <h2>-</h2>
                        </button>
                      </v-col>
                      <v-col cols="4">
                        {{ item?.values }}
                      </v-col>
                      <v-col cols="4">
                        <button v-if="drawer.getStackAt(index).values < maximumValues" class="circle"
                          style="background-color: greenyellow;" @click="drawer?.updateStackValues('add', index)">
                          <h2>+</h2>
                        </button>
                        <button v-else class="circle" style="background-color: grey;" disabled>
                          <h2>+</h2>
                        </button>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
          <v-row v-if="!drawer?.stackEmpty()">
            <v-btn color="success" block @click="page = 'generate'">
              Enter
            </v-btn>
          </v-row>
        </v-container>
      </v-dialog>
    </template>
    <template v-if="page === 'generate'">
      <v-dialog v-model="dialog" :overlay="false" width="600px" transition="dialog-transition">
        <v-container class="bg-indigo-accent-1">
          <v-row>
            <v-col cols="8" justify="center" class="text-lg-left">
              <h2 style="color: #546E7A; font-weight: bold;">
                SELECT OPTIONS
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" offset="1">
              <v-card class="bg-green-accent-3" height="250px" align="center" @click="generatePDF(0)">
                <svg-icon type="mdi" :path="mdiFileDownload" size="150" color="#FF6D00" />
                <v-card-text>
                  <h2>Download Build List</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="10" offset="1">
              <v-card :class="ProxyState?.status ? 'bg-indigo-accent-4' : 'bg-teal-lighten-5'" align="center"
                height="250px" @click="ProxyState?.status ? generatePDF(1) : login()">
                <template v-if="ProxyState?.status">
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <svg-icon type="mdi" :path="mdiFilePdfBox" size="120" />
                      </v-col>
                      <v-col cols="6">
                        <svg-icon type="mdi" :path="mdiContentSavePlus" size="120" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-card-text align="center">
                        <h2>
                          Download Build List & Save on account
                        </h2>
                      </v-card-text>
                    </v-row>
                  </v-container>
                </template>
                <template v-else>
                  <svg-icon type="mdi" :path="mdiArchiveLock" size="150" color="#00796B" />
                  <v-card-text align="center">
                    <h2>
                      You must Login for access more features.
                    </h2>
                  </v-card-text>
                </template>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-btn color="warning" block @click="page = 'cart'">
              Back
            </v-btn>
          </v-row>
        </v-container>
      </v-dialog>
    </template>
  </v-container>
</template>

<script setup>
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useDrawer } from "@/stores/DrawerClass";
import { ref, defineExpose, inject } from "vue";
import sarabunFont from "@/assets/fonts/Sarabun-SemiBold.js";
import axios from "axios";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArchiveLock, mdiFileDownload, mdiFilePdfBox, mdiContentSavePlus } from '@mdi/js';
import { useStaticStore } from "@/stores/StaticStore";
import { useRouter } from 'vue-router';
const router = useRouter();

const snackbar = ref(false);
const drawer = useDrawer();
const global = useStaticStore();;
const dialog = ref(false);
const page = ref('cart');
const maximumValues = 5;

const login = () => {
  router.push("/login");
};

const TestProxy = inject('TestProxy');

const callTestProxy = async () => {
  if (!TestProxy) {
    return { status: false, email: undefined };
  }

  return await TestProxy();
};

class ModelObjectPDF {
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
    const details = drawer?.getStackAt(0)?.object?.additionalDetails;
    const keysToKeep = ["Cores", "BaseFrequency", "MaximumTurboPower", "SocketType", "GraphicsModels", "Warranty"];

    this.CPU = Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );

    return this.CPU;
  }

  getMBData() {
    const details = drawer?.getStackAt(1)?.object?.additionalDetails;
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
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }

  getGPUData() {
    const details = drawer?.getStackAt(2)?.object?.additionalDetails; // เปลี่ยน index ตามตำแหน่ง GPU ใน stack
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
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }

  getRAMData() {
    const details = drawer?.getStackAt(3)?.object?.additionalDetails; // เปลี่ยน index ให้ตรงกับ RAM ใน stack
    const keysToKeep = [
      "MemoryCapacity",
      "Speed",
      "MemoryType",
      "CasLatency",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }

  getM2Data() {
    const details = drawer?.getStackAt(4)?.object?.additionalDetails; // เปลี่ยน index ให้ตรงกับ M.2 SSD ใน stack
    const keysToKeep = [
      "Capacity",
      "Interface",
      "ReadSpeed",
      "WriteSpeed",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }

  getPSUData() {
    const details = drawer?.getStackAt(5)?.object?.additionalDetails; // เปลี่ยน index ให้ตรงกับ PSU ใน stack
    const keysToKeep = [
      "EnergyEfficient",
      "Modular",
      "ContinuousPowerW",
      "MBConnector",
      "PCIeConnector",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }

  getCaseData() {
    const details = drawer?.getStackAt(6)?.object?.additionalDetails; // เปลี่ยน index ให้ตรงกับ CASE ใน stack
    const keysToKeep = [
      "Model",
      "FormFactor",
      "MainboardSupport",
      "VGASupport",
      "PowerSupplySupport",
      "Warranty"
    ];

    return Object.fromEntries(
      keysToKeep.map((key) => [key, details[key]]).filter(([key, value]) => value !== undefined)
    );
  }
}

async function createUserBuild(userEmail, selectedParts) {
  try {
    const response = await axios.post("http://localhost:5000/api/setcomputer/user-builds", {
      userEmail,
      selectedParts,
    });

    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

const usePrintPDF = () => {
  // global.setStatusPDF(true);

  dialog.value = true;
  page.value = 'cart';
  console.warn(`global : ${global.getStatusPDF()}`)
}

const dataPDF = new ModelObjectPDF();

const formatDetails = (details) => {
  if (!details || typeof details !== "object") return "N/A";
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

const formatFunctions = {
  0: () => dataPDF.getCPUData(),
  1: () => dataPDF.getMBData(),
  2: () => dataPDF.getGPUData(),
  3: () => dataPDF.getRAMData(),
  4: () => dataPDF.getM2Data(),
  5: () => dataPDF.getPSUData(),
  6: () => dataPDF.getCaseData(),
};

const getFormattedDetails = (index) => {
  const formatFunction = formatFunctions[index];
  return formatFunction ? formatDetails(formatFunction()) : "N/A";
};

const ProxyState = await callTestProxy();

const generatePDF = async (index) => {
  let count = 0;
  for (let i = 0; i < drawer?.getStack()?.length; i++) {
    if (drawer?.getStackAt(i)?.status === 1) {
      count++;
    }
  }
  if (count < drawer?.getStack()?.length - 2) {
    alert(`Empty Data`);
    return;
  }
  if (!confirm("Download PDF?")) return;
  const doc = new jsPDF();

  doc.addFileToVFS("Sarabun-SemiBold.ttf", sarabunFont);
  doc.addFont("Sarabun-SemiBold.ttf", "Sarabun", "bold");
  doc.setFont("Sarabun");

  doc.text("Computer Build List", 16, 10);
  const Proxy = await callTestProxy();
  if (Proxy.status) {
    let email = Proxy.email;
    doc.text(`Email: ${email}`, 14, 16);
  }

  const columns = ["No", "Name", "Details", "Amount", "Price"];

  const totalPrice = drawer.getStack()
    .filter((item) => item.status === 1)
    .reduce((sum, item) => sum + (item.price * item.values), 0);

  const rows = drawer.getStack()
    .filter((item) => item.status === 1)
    .map((item, index) => [
      index + 1,
      item.object.name,
      getFormattedDetails(index),
      item.values,
      `${item.price.toFixed(2)}`,
    ]);




  rows.push([
    { content: "Total", colSpan: 4, styles: { halign: "right", fontStyle: "bold" } },
    `${totalPrice.toFixed(2)}`,
  ]);

  rows.push([
    { content: `ราคาสุทธิ`, colSpan: 3, styles: { halign: `right`, fontSize: 14, fontStyle: `bold` } },
    `${totalPrice.toFixed(2)}`, `บาทถ้วน`
  ]);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 20,
    theme: "grid",

    headStyles: {
      fillColor: [0, 128, 0], // สีเขียว
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
  if (Proxy.status) {
    let item_id = drawer?.getStack()
      ?.filter(st => st?.status === 1) // ✅ กรองเฉพาะ status === 1
      .map(st => st?.object?._id) // ✅ ดึงเฉพาะ _id

    // ✅ ตรวจสอบว่า item_id เป็น ObjectId ที่ถูกต้อง
    drawer?.getStack()?.filter(st => st?.status === 1).forEach((st, i) => {
      console.log(`stackID [${i}] ${st?.object?._id || "No ID"}`);
    });
    if (index) {
      createUserBuild(Proxy.email, item_id);
    }

  }
  snackbar.value = true;
  global.setGoDownload(false);
};

defineExpose({ generatePDF });
</script>

<style scoped>
.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  font-size: 20px;
  font-weight: 800;
  color: #000000;
  cursor: pointer;
}

.pageCart {
  min-width: 700px;
  min-height: 600px;
  border: #ffffff8b 4px solid;
  border-radius: 12px;
}

.rowItemCart {
  border: #546E7A 2px solid;
  height: 40px;
  margin-top: 10px;
  padding: 4px;
  overflow: hidden;
}

.pdf {
  width: 200px;
  height: 100px;
  background-color: black;
  color: white;
}
</style>