<template>
  <v-card v-if="productStore">
    <v-layout>
      <v-navigation-drawer ref="scrollContainer" class="bg-deep-purple" theme="light" permanent app
        style="height: auto; transform: translateY(0px); overflow-y: auto;">
        <v-card class="mt-2 sticky-total" elevation="4">
          <v-list color="transparent">
            <v-list-item title="Total">
              <h4>{{ drawer.Price.toFixed(2) }} $</h4>
            </v-list-item>
          </v-list>
        </v-card>

        <v-list>
          <v-list-item v-for="(item, index) in drawer.Menu" :key="index">
            <template v-if="(drawer.stack[index].status === 0)">
              <v-card block class="text-start" @click="products.selectMenu(index)">
                <svg-icon type="mdi" :path="item.icon" />
                {{ item.name }}
              </v-card>
            </template>

            <template v-else-if="(drawer.stack[index].status === 1)">
              <v-card class="bg-deep-purple-lighten-5 cursor-default">
                <v-row>
                  <v-col cols="6">
                    <v-img width="50px" :src="drawer.stack[index].img" />
                  </v-col>
                  <v-col cols="6">
                    <svg-icon type="mdi" :path="mdiLocationExit" size="40"
                      style="transform: translateX(90%) translateY(20%);" class="cursor-pointer text-red"
                      @click="drawer.StackPop(index)" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-card-text>
                    {{ drawer.stack[index].name }}
                  </v-card-text>
                </v-row>
              </v-card>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>


      <v-main>
        <v-container>
          <!--test Zone-->
          <v-row v-if="openTest === 1">
            <v-col v-for="(item, index) in drawer.Stack" :key="index" cols="2">
              <v-btn :color="item.status === 1 ? 'success' : 'warning'" @click="drawer.swapStatus(index, ARR)">
                {{ index }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="openTest === 1">
            <v-col cols="4">
              <v-btn color="warning" block>
                {{ products.ProductSize(products.CurrentMenu) ?? 0 }}
              </v-btn>
            </v-col>
          </v-row>
          <!--Features Box-->
          <v-card class="text-center bg-indigo-lighten-2 sticky-header">
            <!--Search Box-->
            <v-container class="search-container">
              <v-card>
                <v-text-field v-model="searchQuery" label="Search Product" variant="solo" clearable
                  prepend-inner-icon="mdi-magnify" class="custom-search" style="width: 400px;" density="comfortable"
                  @click:clear="ClearSearch" />

                <!-- Grid แสดงสินค้า -->
                <!-- แสดงสินค้าถ้ามีข้อมูล -->
                <v-row v-if="filteredProducts && filteredProducts.length > 0">
                  <v-col v-for="product in filteredProducts" :key="product.id" cols="12">
                    <v-card class="pa-1 bordered-card bg-green-lighten-5">
                      <v-row align="center">
                        <v-col cols="2">
                          <v-img :src="product.img" height="50px" width="50px" cover />
                        </v-col>
                        <v-col cols="6" class="text-start">
                          {{ product.name }}
                        </v-col>
                        <v-col cols="2" class="text-start">
                          {{ product.price.toFixed(2) }} ฿
                        </v-col>
                        <v-col cols="2">
                          <v-btn color="success" @click="openDialog(product)">
                            Info
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
                <template v-if="openTest === 2">
                  <v-dialog v-model="dialog" width="auto">
                    <v-card max-width="600" prepend-icon="mdi-database" title="Product Info">
                      <v-card-text>
                        <p><strong>Name:</strong> {{ selectedProduct?.name || "N/A" }}</p>
                        <p><strong>Price:</strong> {{ selectedProduct?.price?.toFixed(2) || "0.00" }} ฿</p>
                        <p>
                          <strong>Description:</strong> {{ selectedProduct?.description || "No description available"
                          }}
                        </p>
                      </v-card-text>
                      <template #actions>
                        <v-btn class="ms-auto" text="Ok" @click="dialog = false" />
                      </template>
                    </v-card>
                  </v-dialog>
                </template>
                <!-- แสดง "No products found." ถ้าพิมพ์แล้วแต่ไม่เจอ -->
                <v-alert v-else-if="filteredProducts !== null && filteredProducts.length === 0" type="info">
                  No products found.
                </v-alert>
              </v-card>
            </v-container>
            <!--Filter Block-->
            <v-menu transition="scale-transition">
              <template #activator="{ props: menu }">
                <v-tooltip location="top">
                  <template #activator="{ props: tooltip }">
                    <v-btn color="primary" v-bind="mergeProps(menu, tooltip)">
                      <svg-icon type="mdi" :path="mdiSwapVertical" />
                      <h4>Filter</h4>
                    </v-btn>
                  </template>
                  <span>Sort price</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index" @click="products.selectSort(index)">
                  <svg-icon type="mdi" :path="item.icon" />
                  {{ item.title }}
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn class="bg-deep-orange-lighten-1">
              {{ products.ProductSize(products.CurrentMenu) ?? 0 }}
            </v-btn>
          </v-card>
          <!--items Box-->
          <v-card style="height: 100vh; overflow-y: auto;">
            <v-row>
              <template v-if="products.getProduct(products.CurrentMenu).length > 0">
                <v-col v-for="(item, index) in products.getProduct2(products.CurrentMenu)" :key="index" cols="3"
                  style="transform: translateY(80px);">
                  <v-card style="max-height: 380px;">
                    <v-img :src="item.img" max-width="250px" />
                    <v-card-title primary-title style="font-size: 10px;">
                      {{ item.name }}
                    </v-card-title>
                    <v-card-actions>
                      <v-card-title primary-title>
                        <p style="font-size: 20px;">
                          {{ item.price.toFixed(2) }} ฿
                        </p>
                      </v-card-title>
                      <v-btn color=" #FFFFFF" style="background-color:#42A5F5;" @click="drawer.StackAdd(index)">
                        <p style="font-size: 10px;">
                          ADD
                        </p>
                        <v-icon icon="mdi-checkbox-marked-circle" end />
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </template>
              <template v-else>
                <v-sheet
                  class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4 bg-grey-darken-3 emptydata"
                  elevation="4" height="250" max-width="600" width="100%" rounded style="transform: translateY(80%);">
                  <div>
                    <h2 class="text-h3 font-weight-black text-red-lighten-1">
                      SORRY...
                    </h2>

                    <div class="text-h4 text-orange-lighten-1 font-weight-medium mb-2">
                      Somethings...Wrong!
                    </div>

                    <div class="text-h5 font-weight-medium mb-2">
                      Data is empty.
                    </div>
                  </div>
                </v-sheet>
              </template>
            </v-row>
          </v-card>
          <!--Pagination-->
          <v-card v-if="products.ProductSize(products.CurrentMenu) > 0" class="text-center">
            <v-pagination v-model="products.page" :length="products.ProductSize(products.CurrentMenu) / 15 + 1 ?? 1"
              :total-visible="4" />
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { mergeProps, ref, reactive, computed, watchEffect, onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSwapVertical, mdiArrowDown, mdiArrowUp, mdiLocationExit } from '@mdi/js';
import { useProductStore } from '@/stores/ProductStore'

const openTest = ref(2);
const dialog = ref(false);
const products = ref(null);
const selectedProduct = ref(null);
const productStore = useProductStore()

const openDialog = (product) => {
  selectedProduct.value = product;
  dialog.value = true;
};

onMounted(() => {
  productStore.fetchAllProducts() // โหลดข้อมูลทั้งหมด
})

class Drawer {
  menu = [];
  stack = [];
  price;
  constructor(Menus) {
    this.menu = Menus;
    this.price = 0;
    this.stack = Array.from({ length: 9 }, () => ({ status: 0, name: "null", price: 0, img: "null", socket: 'null' }));
  }

  get Menu() {
    return this.menu.map(m => ({ icon: m.icon, name: m.name }));
  }

  get Stack() {
    return this.stack.map(s => ({ status: s.status, name: s.name, price: s.price, img: s.img, socket: s.socket }));
  }

  get MenuSize() {
    return this.menu.length;
  }

  get Price() {
    return this.price;
  }

  getStack(index) {
    return this.stack[index];
  }

  StackAdd(index) {
    const arr = products.value.getProduct(products.value.CurrentMenu);
    const temp = arr[index];

    if (!temp) {
      console.error(`❌ Error: No product found at index ${index}`);
      return;
    }
    console.log(`📌 Before Menu Index: ${products.value.CurrentMenu}`);
    console.log(`📌 Before: stack[${index}] =`, this.stack[index]);

    // const newName = temp.name.replace(/cpu\s*\(ซีพียู\)\s*/i, "").replace(/\s*\(3Y\)$/, "")
    const newName = temp.name.replace(/^(CPU|MAINBOARD|VGA|RAM|SSD|HDD|COOLER|PSU|CASE|M.2)\s*\(.*?\)\s*/i, "").replace(/\s*\(3Y\)$/, "")
    this.stack[products.value.CurrentMenu] = {
      status: 1, name: newName, price: temp.price, img: temp.img,
      socket: products.value.CurrentMenu === 0 ? temp.additionalDetails.SocketType : products.value.CurrentMenu === 1 ? temp.additionalDetails.CPUSocket : "Null"
    };

    console.log(`✅ After: stack[${index}] =`, this.stack[index]);
    console.log(`📌 Current Menu Index: ${products.value.CurrentMenu}`);
    this.Calculate();
  }

  StackPop(index) {
    this.stack[index] = { status: 0, name: 'null', price: 0, img: "null", socket: "null" };
    this.Calculate();
  }

  Calculate() {
    this.price = this.stack.reduce((sum, item) => sum + item.price, 0);
    console.log(`Now Price : ${this.price}`);
  }

}

class Products {
  allProducts;
  currentMenu;
  sorted;
  countProducts = [];
  typtProducts = [];
  page;
  start;
  end;
  max;

  constructor(store) {
    this.allProducts = store;
    this.max = 15;
    this.currentMenu = 0;
    this.updateCountProducts();
    this.page = 1;
    this.start = 0;
    this.end = 15;
  }


  updateCountProducts() {
    this.countProducts = [
      this.allProducts.cpuCount ?? 0,
      this.allProducts.mainboardCount ?? 0,
      this.allProducts.gpuCount ?? 0,
      this.allProducts.ramCount ?? 0,
      this.allProducts.m2Count ?? 0,
      this.allProducts.psuCount ?? 0,
      this.allProducts.caseCount ?? 0
    ];

    this.typeProducts = [
      this.allProducts.cpus ?? "N/A",
      this.allProducts.mainboards ?? "N/A",
      this.allProducts.gpus ?? "N/A",
      this.allProducts.rams ?? "N/A",
      this.allProducts.m2s ?? "N/A",
      this.allProducts.psus ?? "N/A",
      this.allProducts.cases ?? "N/A",
    ]
  }

  selectMenu(index) {
    this.currentMenu = index;
    this.page = 1;
  }

  selectSort(index) {
    this.sorted = index;
  }

  ProductSize(index) {
    return this.countProducts[index] ?? 0;
  }

  getProduct(index) {
    if (index < 0 || this.page < 1) {
      console.log("❌ ERROR -> index < 0 && page < 1");
      return [];
    }

    if (!Array.isArray(this.typeProducts[index])) {
      console.warn(`⚠️ getProduct2: typeProducts[${index}] is not an array.`);
      return [];
    }

    let normal = [...this.typeProducts[index]];
    let expensive = [...this.typeProducts[index]].sort((a, b) => b.price - a.price);
    let cheap = [...this.typeProducts[index]].sort((a, b) => a.price - b.price);

    this.start = (this.page - 1) * this.max;
    this.end = this.page * this.max;

    switch (this.sorted) {
      case 0: return expensive.slice(this.start, this.end);
      case 1: return cheap.slice(this.start, this.end);
      case 2: return normal.slice(this.start, this.end);
      default: return normal.slice(this.start, this.end);
    }
  }

  getProduct2(index) {
    if (this.currentMenu < 0 || this.page < 1) {
      console.log("❌ ERROR -> index < 0 && page < 1");
      return [];
    }

    if (!Array.isArray(this.typeProducts[this.currentMenu])) {
      console.warn(`⚠️ getProduct2: typeProducts[${this.currentMenu}] is not an array.`);
      return [];
    }

    this.start = (this.page - 1) * this.max;
    this.end = this.page * this.max;

    // ✅ ตรวจสอบ stack[0] ว่ามี CPU หรือยัง
    const Scpu = drawer.value.getStack(0);
    const Smainboard = drawer.value.getStack(1);

    if (Scpu.status === 1) { // ✅ ถ้ามี CPU แล้ว
      console.log("✅ CPU Detected:", Scpu);

      // ✅ กรอง Mainboard ที่รองรับ CPU ที่เลือก
      const filteredMainboards = this.typeProducts[1].filter(mb => mb.additionalDetails?.CPUSocket === Scpu.socket);

      console.log("✅ Compatible Mainboards:", filteredMainboards);

      // ✅ ถ้า Mainboard ไม่ตรงกับ CPU ให้ Pop ออก
      if (Smainboard.status === 1 && Smainboard.socket !== Scpu.socket) {
        console.warn(`⚠️ Mainboard (${Smainboard.name}) ไม่ตรงกับ CPU (${Scpu.name}), ลบออก...`);
        drawer.value.StackPop(1);
      }

      // ✅ คืนค่า Mainboard ที่รองรับ CPU
      if (index === 1) return filteredMainboards;
    }

    let normal = [...this.typeProducts[this.currentMenu]];
    let expensive = [...this.typeProducts[this.currentMenu]].sort((a, b) => b.price - a.price);
    let cheap = [...this.typeProducts[this.currentMenu]].sort((a, b) => a.price - b.price);

    switch (this.sorted) {
      case 0: return expensive.slice(this.start, this.end);
      case 1: return cheap.slice(this.start, this.end);
      case 2: return normal.slice(this.start, this.end);
      default: return normal.slice(this.start, this.end);
    }
  }



  getPage() {
    return this.page;
  }

  getMax() {
    return this.max;
  }
  get CurrentMenu() {
    return this.currentMenu;
  }
}


//Search
const searchQuery = ref('');
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return null; // ✅ ถ้ายังไม่พิมพ์อะไร ให้คืนค่า null
  const result = productStore.allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return result.length ? result : []; // ✅ ถ้าหาไม่เจอให้คืนเป็น [] เพื่อแสดงข้อความ "No products found."
});

const ClearSearch = () => {
  searchQuery.value = "";
};



watchEffect(() => {
  if (productStore.cpuCount !== undefined) {
    products.value = new Products(productStore); // ✅ รอให้ store โหลดก่อนสร้าง instance
  }
});

const drawer = ref(new Drawer(productStore.Menu));

const items = [
  { title: 'Expensive', icon: mdiArrowUp },
  { title: 'Cheap', icon: mdiArrowDown },
];

</script>

<style lang="scss" scoped>
.sticky-total {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.sticky-header {
  position: fixed;
  top: 64px;
  /* ปรับให้ไม่ทับ v-app-bar (ถ้ามี) */
  left: 20%;
  width: 75%;
  z-index: 1100;
  /* ให้สูงกว่า v-navigation-drawer */
  background: #6C75E0;
  padding: 10px;
  max-height: 600px;
  overflow-y: auto;
}

.fixedClass {
  position: fixed !important;
  top: 10;
  left: 10;
  width: 77.3vw;
  z-index: 1100;
}

.emptydata {
  position: fixed;
  left: 40%;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
}
</style>
