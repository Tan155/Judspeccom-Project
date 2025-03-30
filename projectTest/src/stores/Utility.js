import { defineStore } from "pinia";

export const useUtility = defineStore("Utility", () => {
  const formatPrice = (price) => {
    if (!price) return 0;
    return (
      price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " ฿"
    );
  };

  const formatPrice2 = (price) => {
    if (!price) return 0;
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const cleanNameItem = (name) => {
    if (!name) return "";
    return name.replace(/\s*\([^)]*\)/, "").trim();
  };

  return {
    formatPrice,
    formatPrice2,
    cleanNameItem,
  };
});
