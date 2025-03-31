import { defineStore } from "pinia";

//Import method from vue.
import { reactive, ref } from "vue";
//Import External Class.
import { useProductStore } from "./ProductStore";
import {
  mdiCpu64Bit,
  mdiChip,
  mdiExpansionCard,
  mdiHarddisk,
  mdiNas,
  mdiGeneratorPortable,
  mdiServer,
} from "@mdi/js";

//Main.
export const useDrawer = defineStore("Drawer", () => {
  //Call external class.
  const products = useProductStore();
  // Variables.
  let price = ref(0);
  const stack = reactive(
    Array.from({ length: 9 }, () => ({
      status: 0,
      name: "null",
      price: 0,
      img: "null",
      socket: "null",
      object: [],
      values: 0,
    }))
  );

  const menu = ref([
    { icon: mdiCpu64Bit, name: "CPU" },
    { icon: mdiChip, name: "MAINNBOARD" },
    { icon: mdiExpansionCard, name: "GRAPHIC CARD" },
    { icon: mdiNas, name: "RAM" },
    { icon: mdiHarddisk, name: "SSD M.2" },
    { icon: mdiGeneratorPortable, name: "POWER SUPPLY" },
    { icon: mdiServer, name: "CASE" },
  ]);

  //getter.
  function getMenu() {
    return menu.value.map((m) => ({ icon: m.icon, name: m.name }));
  }

  function getStack() {
    return stack.map((s) => ({
      status: s.status,
      name: s.name,
      price: s.price,
      img: s.img,
      socket: s.socket,
      object: s.object,
      values: s.values,
    }));
  }

  function getPrice() {
    let error = 0;
    // return `${price.value.toFixed(2) ?? error.toFixed(2)}`;
    if (price.value) {
      return (
        price.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ` ฿`
      );
    }
    return `${error.toFixed(2)} ฿`;
  }

  function getStackAt(index) {
    if (index < 0 || index >= stack.length) {
      console.warn(`⚠️ Index ${index} is out of bounds.`);
      return null;
    }
    return stack[index];
  }

  let isProcessing = false;

  function StackAdd(item) {
    if (isProcessing) return;
    isProcessing = true;

    const temp = item;
    const CurrentMenu = products.getCurrentMenu();

    if (!temp) {
      console.error(`❌ no index  : ${CurrentMenu}`);
      isProcessing = false;
      return;
    }

    console.log(`📌 B Menu: ${CurrentMenu}`);
    console.log(
      `📌 B Stack : [${CurrentMenu}] =`,
      stack[CurrentMenu]?.name ?? "null"
    );

    const newName =
      temp.name.replace(/^[A-Z]+\s*\([^)]*\)\s*/i, "").trim() ?? "null";
    stack[CurrentMenu] = {
      status: 1,
      name: newName,
      price: temp.price,
      img: temp.img,
      socket:
        CurrentMenu === 0
          ? temp?.additionalDetails?.SocketType
          : CurrentMenu === 1
          ? temp?.additionalDetails?.CPUSocket
          : CurrentMenu === 3
          ? temp?.additionalDetails?.MemoryType
          : "Null",
      object: temp,
      values: 1,
    };

    console.log(`📌 A Menu : ${CurrentMenu}`);
    console.log(`✅ A Stack [${CurrentMenu}] =`, stack[CurrentMenu].name);
    testStack();

    Calculate();

    isProcessing = false;
  }

  function StackPop(index) {
    stack[index] = {
      status: 0,
      name: "null",
      price: 0,
      img: "null",
      socket: "null",
      object: [],
      values: 0,
    };
    Calculate();
  }

  function Calculate() {
    price.value = stack.reduce((sum, item) => sum + item?.price, 0);
    console.log(`Now Price : ${price.value}`);
  }

  function testStack() {
    console.table(stack);
    console.table(stack[0]?.object?._id ?? "null");
    tableID();
  }

  function tableID() {
    stack.forEach((st, i) => {
      console.log(`stackID [${i}] ${st?.object?._id || "No ID"}`);
    });
  }

  function stackEmpty() {
    let status = ref(true);
    stack.forEach((st) => {
      if (st?.status === 1) {
        status.value = false;
      }
    });
    return status.value;
  }

  function updateStackValues(option, index) {
    //Check null
    if (index < 0 && (option !== "add" || option !== "pop")) {
      console.error(`updateStackValues(${option}, ${index} ) is error`);
      return;
    }
    if (option === "add") {
      stack[index].values = stack[index].values + 1;
    } else if (option === "pop") {
      stack[index].values = stack[index].values - 1;
    } else {
      console.error(`updateStackValues(${option}, ${index} ) is error`);
    }
  }

  return {
    StackAdd,
    StackPop,
    getPrice,
    getStack,
    getMenu,
    getStackAt,
    updateStackValues,
    stackEmpty,
  };
});
