import { defineStore } from "pinia";

//Import method from vue.
import { reactive, ref } from "vue";
//Import External Class.
import { useProductStore } from "./ProductStore";
//Import MDI icons.
//https://pictogrammers.com/library/mdi/
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
    }))
  );

  const menu = ref([
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
    }));
  }

  function getPrice() {
    let error = 0;
    return `${price.value.toFixed(2) ?? error.toFixed(2)} ฿`;
  }

  function getStackAt(index) {
    if (index < 0 || index >= stack.length) {
      console.warn(`⚠️ Index ${index} is out of bounds.`);
      return null;
    }
    return stack[index];
  }

  //Methods.
  function StackAdd(item) {
    const temp = item;
    const CurrentMenu = products.getCurrentMenu();

    if (!temp) {
      console.error(`❌ no index  : ${CurrentMenu}`);
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
    };

    console.log(`📌 A Menu : ${CurrentMenu}`);
    console.log(`✅ A Stack [${CurrentMenu}] =`, stack[CurrentMenu].name);
    testStack();

    Calculate();
  }

  function StackPop(index) {
    stack[index] = {
      status: 0,
      name: "null",
      price: 0,
      img: "null",
      socket: "null",
    };
    Calculate();
  }

  function Calculate() {
    price.value = stack.reduce((sum, item) => sum + item.price, 0);
    console.log(`Now Price : ${price.value}`);
  }

  function testStack() {
    console.table(stack);
  }

  return {
    StackAdd,
    StackPop,
    getPrice,
    getStack,
    getMenu,
    getStackAt,
    // Stack,
  };
});
