<template>
  <v-btn color="info" width="300" height="100" @click="generatePDF">
    Download PDF
  </v-btn>

  <v-snackbar v-model="snackbar" :timeout="3000">
    PDF Exported Successfully!
  </v-snackbar>
</template>

<script setup>
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useDrawer } from "@/stores/DrawerClass";
import { ref } from "vue";
import sarabunFont from "@/assets/fonts/Sarabun-SemiBold.js";



const snackbar = ref(false);
const drawer = useDrawer();

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

const dataPDF = new ModelObjectPDF();

const formatDetails = (details) => {
  if (!details || typeof details !== "object") return "N/A";
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};

const cleanName = (name) => {
  return name.replace(/\s*\([^)]*\)/, "").trim();
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

const generatePDF = () => {
  if (!confirm("Download PDF?")) return;
  const doc = new jsPDF();

  doc.addFileToVFS("Sarabun-SemiBold.ttf", sarabunFont);
  doc.addFont("Sarabun-SemiBold.ttf", "Sarabun", "bold");
  doc.setFont("Sarabun");

  doc.text("Computer Build List", 16, 10);

  const columns = ["No", "Name", "Details", "Amount", "Price"];

  const totalPrice = drawer.getStack()
    .filter((item) => item.status === 1)
    .reduce((sum, item) => sum + item.price, 0);

  const rows = drawer.getStack()
    .filter((item) => item.status === 1)
    .map((item, index) => [
      index + 1,
      cleanName(item.name),
      getFormattedDetails(index),
      1,
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
  snackbar.value = true;
};
</script>
