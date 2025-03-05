import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

import {
  mdiCpu64Bit,
  mdiChip,
  mdiExpansionCard,
  mdiHarddisk,
  mdiNas,
  mdiGeneratorPortable,
  mdiServer,
  mdiFan,
  mdiMonitorScreenshot,
  // mdiAlphaXCircle,
  // mdiDeleteCircle,
} from "@mdi/js";

export const useProductStore = defineStore("productStore", () => {
  // ✅ State สำหรับเก็บข้อมูล
  const cpus = ref([]);
  const gpus = ref([]);
  const mainboards = ref([]);
  const rams = ref([]);
  const psus = ref([]);
  const m2s = ref([]);
  const cases = ref([]);

  const Menu = ref([
    { icon: mdiCpu64Bit, name: "ซีพียู" },
    { icon: mdiChip, name: "เมนบอร์ด" },
    { icon: mdiExpansionCard, name: "การ์ดจอ" },
    { icon: mdiNas, name: "แรม" },
    { icon: mdiHarddisk, name: "การ์ด M.2" },
    { icon: mdiGeneratorPortable, name: "พาวเวอร์ซัพพลาย" },
    { icon: mdiServer, name: "เคส" },
    { icon: mdiFan, name: "พัดลม" },
    { icon: mdiMonitorScreenshot, name: "จอมอนิเตอร์" },
  ]);

  const loading = ref(false);
  const error = ref(null);

  // ✅ Fetch CPU
  const fetchCpus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/cpu"
      );
      cpus.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch GPU
  const fetchGpus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/gpu"
      );
      gpus.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch Mainboard
  const fetchMainboards = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/mainboard"
      );
      mainboards.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch RAM
  const fetchRams = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/ram"
      );
      rams.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch PSU
  const fetchPsus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/psu"
      );
      psus.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch M.2 Storage
  const fetchM2s = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get("http://localhost:5000/api/products/m2");
      m2s.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch Case
  const fetchCases = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/case"
      );
      cases.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Fetch ข้อมูลทั้งหมดพร้อมกัน
  const fetchAllProducts = async () => {
    await Promise.all([
      fetchCpus(),
      fetchGpus(),
      fetchMainboards(),
      fetchRams(),
      fetchPsus(),
      fetchM2s(),
      fetchCases(),
    ]);
  };

  // ✅ Getters (จำนวนสินค้าแต่ละประเภท)
  const cpuCount = computed(() => cpus.value.length);
  const gpuCount = computed(() => gpus.value.length);
  const mainboardCount = computed(() => mainboards.value.length);
  const ramCount = computed(() => rams.value.length);
  const psuCount = computed(() => psus.value.length);
  const m2Count = computed(() => m2s.value.length);
  const caseCount = computed(() => cases.value.length);

  const superLength = computed(
    () =>
      cpuCount.value +
      gpuCount.value +
      mainboardCount.value +
      ramCount.value +
      psuCount.value +
      m2Count.value +
      caseCount.value
  );

  const allProducts = computed(() => [
    ...cpus.value,
    ...gpus.value,
    ...mainboards.value,
    ...rams.value,
    ...psus.value,
    ...m2s.value,
    ...cases.value,
  ]);

  let cmn = ref(0);

  const setCurrentMenu = (index) => {
    cmn.value = index;
  };

  const getCurrentMenu = () => {
    return cmn.value;
  };

  return {
    cpus,
    mainboards,
    gpus,
    rams,
    m2s,
    psus,
    cases,
    loading,
    error,
    fetchCpus,
    fetchGpus,
    fetchMainboards,
    fetchRams,
    fetchPsus,
    fetchM2s,
    fetchCases,
    fetchAllProducts,
    allProducts,
    cpuCount,
    gpuCount,
    mainboardCount,
    ramCount,
    psuCount,
    m2Count,
    caseCount,
    Menu,
    superLength,
    setCurrentMenu,
    getCurrentMenu,
  };
});
