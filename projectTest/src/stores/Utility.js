import { defineStore } from "pinia";

export const useUtility = defineStore("Utility", () => {
  const formatPrice = (price) => {
    return (
      price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " ฿"
    );
  };

  const cleanNameItem = (name) => {
    return name.replace(/\s*\([^)]*\)/, "").trim();
  };

  return {
    formatPrice,
    cleanNameItem,
  };
});
