import { defineStore } from "pinia";
import { ref } from "vue";

export const useStaticStore = defineStore("StaticStore", () => {
  const statusPDF = ref(false);
  const goDownload = ref(false);

  function getStatusPDF() {
    return statusPDF.value;
  }

  function setStatusPDF(newStatus) {
    statusPDF.value = newStatus;
  }

  function getGoDownload() {
    return goDownload.value;
  }

  function setGoDownload(newValue) {
    goDownload.value = newValue;
  }

  return {
    getStatusPDF,
    getGoDownload,
    setStatusPDF,
    setGoDownload,
  };
});
