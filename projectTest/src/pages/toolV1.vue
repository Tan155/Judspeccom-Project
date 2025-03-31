<template>
  <template v-if="isLoading">
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
      <v-progress-circular :size="130" :width="12" color="primary" indeterminate
        style="transform: translateY(-20vh);" />
    </v-container>
  </template>

  <template v-else>
    <v-card v-if="productStore" class="test">
      <v-layout>
        <v-navigation-drawer ref="scrollContainer" class="Fill-product" permanent app>
          <v-card class="mt-2 sticky-total" elevation="4">
            <v-list class="Total">
              <v-list-item title="Total">
                <h4>{{ drawer?.getPrice() }}</h4>
              </v-list-item>
            </v-list>
          </v-card>

          <v-list>
            <v-list-item v-for="(item, index) in drawer?.getMenu()" :key="index">
              <template v-if="(drawer?.getStackAt(index)?.status === 0)">
                <v-card block class="block-product" @click="products.selectMenu(index)">
                  <svg-icon type="mdi" :path="item?.icon" style="width: 40px; height: 40px; margin-right: 8px;" />
                  {{ item?.name ?? 'N/A' }}
                </v-card>
              </template>

              <template v-else-if="(drawer?.getStackAt(index)?.status === 1)">
                <v-card class="cursor-default" color="#BBDEFB" @click="products?.selectMenu(index)" style="border: solid 1px black; min-height: 120px;">
                  <v-row>
                    <v-col cols="6">
                      <v-img width="50px" class="cursor-pointer" :src="drawer?.getStackAt(index)?.img"
                        @click="openDialog(drawer?.getStackAt(index)?.object)" />
                    </v-col>
                    <v-col cols="4">
                      <svg-icon type="mdi" :path="mdiLocationExit" size="40"
                        style="transform: translateX(90%) translateY(20%);" class="cursor-pointer text-red"
                        @click="drawer?.StackPop(index)" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-card-text style="transform: translateY(-20px);">
                      {{ drawer?.getStackAt(index)?.name }}
                    </v-card-text>
                  </v-row>
                </v-card>
              </template>
            </v-list-item>
          </v-list>
          <Suspense>
            <v-container style="transform: translateX(10px);">
              <PDF ref="pdf" />
            </v-container>
          </Suspense>
        </v-navigation-drawer>

        <v-main>
          <v-container class="mb-10">
            <!--Features Box-->
            <v-card class="main-search">
              <!--Search Box-->
              <v-container class="search-container">
                <v-card class=" behide-search ">
                  <v-text-field v-model="searchQuery" label="Search Product" clearable prepend-inner-icon="mdi-magnify"
                    class="custom-search" @click:clear="ClearSearch" />

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
                      <v-card style="background-color: whitesmoke ; color: black; overflow-x: auto; overflow-y: auto; width: 800px; margin-top: 50px;">
                        <p class="Titleinfo"> Product Info </p>
                        <v-card-text class="Finfo">
                          <p><strong>Name:</strong> {{ selectedProduct?.name || "N/A" }}</p>
                          <br>
                          <p><strong>Price:</strong> {{ selectedProduct?.price?.toFixed(2) || "0.00" }} ฿</p>
                        </v-card-text>
                        <div class="Sinfo">
                          <thead class="F-Sinfo">
                            <th style="transform: translateX(-50px);">
                              Option
                            </th>
                            <th style="transform: translateX(10px);">
                              Spec
                            </th>
                          </thead>
                          <tbody class="S-Sinfo">
                            <tr v-for="(value, key) in selectedProduct?.additionalDetails" :key="key">
                              <td>{{ key }}</td>
                              <td style=" transform: translateX(150px);">
                                {{ value }}
                              </td>
                            </tr>
                          </tbody>
                        </div>

                        <template #actions>
                          <v-btn class="ms-auto" text="Ok" style="background-color: green;" @click="dialog = false" />
                        </template>
                      </v-card>
                    </v-dialog>
                  </template>
                  <!-- แสดง "No products found." ถ้าพิมพ์แล้วแต่ไม่เจอ -->
                  <v-alert v-if="!filteredProducts && searchQuery.length > 0" type="info">
                    No products found.
                  </v-alert>
                </v-card>
              </v-container>


              <!--Filter Block-->
              <div class="block-filter">
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
                <!-- <v-btn class="bg-deep-orange-lighten-1">
                  {{ products?.ProductSize(products?.CurrentMenu) ?? 0 }}
                </v-btn> -->
              </div>
            </v-card>


            <!--items Box-->
            <v-card class="item-Box">
              <v-row align="stretch">
                <template v-if="products?.getProduct(products.CurrentMenu)?.length > 0">
                  <v-col v-for="(item, index) in products?.getProduct()" :key="index" cols="12" sm="6" md="4" lg="3">
                    <v-card class="product-card">
                      <v-img :src="item?.img" max-width="100%" class="IMG_tag" @click="openDialog(item)" />
                      <v-card-title primary-title style="font-size: 10px;">
                        <p style="font-size: 16px;" class="P_tag">
                          {{ item?.name.replace(/\s*\([^)]*\)/, "").trim() }}
                          <v-tooltip activator="parent" location="top">
                            {{ item?.name }}
                          </v-tooltip>
                        </p>
                      </v-card-title>
                      <v-card-actions>
                        <v-card-title primary-title>
                          <p style="font-size: 20px;">
                            {{ formatPrice(item?.price) }}
                          </p>
                        </v-card-title>
                        <v-btn color=" #FFFFFF" style="background-color:green; font-size: 12px;"
                          @click="drawer?.StackAdd(item)">
                          <p style="font-size: 12px;">
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
            <v-card v-if="products?.ProductSize(products?.CurrentMenu) > 0" class="text-center mt-2"
              style="transform: translateY(15px);">
              <v-pagination v-model="products.page"
                :length="Math.ceil(products?.ProductSize(products?.CurrentMenu) / 15 + 1 ?? 1) - 1 ?? 1"
                :total-visible="4" @update:model-value="scrollToTop" />
            </v-card>
          </v-container>
        </v-main>
      </v-layout>
    </v-card>
  </template>
</template>

<script setup>
import { mergeProps, ref, computed, watchEffect, onMounted, shallowReactive, inject } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSwapVertical, mdiArrowDown, mdiArrowUp, mdiLocationExit } from '@mdi/js';
import { useProductStore } from '@/stores/ProductStore'
import PDF from "@/components/PDF.vue";
import { useDrawer } from "@/stores/DrawerClass";

const drawer = useDrawer();
const openTest = ref(2);
const dialog = ref(false);
const products = ref(null);
const selectedProduct = ref(null);
const productStore = useProductStore();
const TestProxy = inject('TestProxy');
const isVerified = ref(false);
const isDarkMode = inject('isDarkMode', ref(false));

const callTestProxy = async () => {
  if (!TestProxy) {
    // alert(`Failed to find TestProxy`);
    return;
  }

  const result = await TestProxy();
  isVerified.value = result.status;
};


const openDialog = (product) => {
  console.log(product?.additionalDetails);
  selectedProduct.value = product;
  dialog.value = true;
};

class Products {
  static instance = null;

  allProducts;
  currentMenu;
  sorted;
  countProducts = [];
  typeProducts = shallowReactive([]);
  page;
  start;
  end;
  max;
  CopyARR = [];

  constructor(store) {
    if (Products.instance) {
      return Products.instance; // ใช้ Instance เดิม ถ้ามีแล้ว
    }

    Products.instance = this;
    this.allProducts = store;
    this.max = 15;
    this.currentMenu = 0;
    this.updateCountProducts();
    this.page = 1;
    this.start = 0;
    this.end = 15;
    this.filteredMainboards = [];
  }

  // ✅ สร้าง Static Method เพื่อใช้ Singleton
  static getInstance(store) {
    if (!Products.instance) {
      Products.instance = new Products(store);
      store.fetchAllProducts();
    }
    return Products.instance;
  }

  updateCountProducts() {
    this.countProducts = [
      this.allProducts.cpuCount ?? 0,
      this.allProducts.mainboardCount ?? 0,
      this.allProducts.gpuCount ?? 0,
      this.allProducts.ramCount ?? 0,
      this.allProducts.m2Count ?? 0,
      this.allProducts.psuCount ?? 0,
      this.allProducts.caseCount ?? 0,
    ];

    this.CopyARR = [
      Array.isArray(this.allProducts.cpus) ? this.allProducts.cpus : [],
      Array.isArray(this.allProducts.mainboards) ? this.allProducts.mainboards : [],
      Array.isArray(this.allProducts.gpus) ? this.allProducts.gpus : [],
      Array.isArray(this.allProducts.rams) ? this.allProducts.rams : [],
      Array.isArray(this.allProducts.m2s) ? this.allProducts.m2s : [],
      Array.isArray(this.allProducts.psus) ? this.allProducts.psus : [],
      Array.isArray(this.allProducts.cases) ? this.allProducts.cases : []
    ];
    this.typeProducts = [...this.CopyARR];
  }

  selectMenu(index) {
    this.currentMenu = index;
    productStore.setCurrentMenu(index);
    this.page = 1;
  }

  selectSort(index) {
    this.sorted = index;
  }

  ProductSize(index) {
    return this.typeProducts[index]?.length ?? 0;
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

  getProduct() {
    if (this.currentMenu < 0 || this.page < 1) {
      console.log("❌ ERROR -> index < 0 && page < 1");
      return [];
    }

    if (!Array.isArray(this.typeProducts[this.currentMenu])) {
      console.warn(`⚠️ GP TPD : [${this.currentMenu}] !arr.`);
      return [];
    }

    this.start = (this.page - 1) * this.max;
    this.end = this.page * this.max;


    //Stack at Products
    const Scpu = drawer?.getStackAt(0) ?? {};
    const Smainboard = drawer?.getStackAt(1) ?? {};
    const Sram = drawer?.getStackAt(3) ?? {};

    let ramMT = Sram?.socket ?? null;
    let mainboardMT = Smainboard?.object?.additionalDetails?.MemoryType ?? 'null';
    console.log(`mainboardMT : [${mainboardMT}]`);
    console.log(`ramMT : [${ramMT}]`);

    let filteredMainboards = [];
    let filteredRams = [];

    console.log(`DT : TYPE ${Scpu?.socket ?? undefined}`);

    if (Scpu?.status === 1) {
      filteredMainboards = [...this.CopyARR[1].filter(mb => mb.additionalDetails?.CPUSocket === Scpu?.socket)];
    } else if (Scpu?.status === 0) {
      filteredMainboards = [...this.CopyARR[1]];
    }



    if (Smainboard?.status === 1) {
      filteredRams = [...this.CopyARR[3].filter(ram => ram?.additionalDetails?.MemoryType === mainboardMT)];
    } else if (Smainboard?.status === 0) {
      filteredRams = [...this.CopyARR[3]];
    }

    console.table(filteredRams[0]?.additionalDetails?.MemoryType ?? []);

    console.log('RAM :' + `${filteredRams[1]?.additionalDetails?.MemoryType ?? []}` + '\n');


    if (Smainboard?.status === 1 && Smainboard?.socket !== Scpu?.socket) {
      console.log(`MB : (${Smainboard?.socket}) != CPU (${Scpu?.socket}), DE`);
      if (drawer?.getStackAt(1)?.socket !== Scpu?.socket && Scpu?.status === 1) {
        drawer?.StackPop(1);
      }
    }

    if (Smainboard?.status === 1 && ramMT && mainboardMT && ramMT !== mainboardMT) {
      console.log(`MB : (${mainboardMT}) != Ram (${ramMT}), DE`);
      if (Sram?.status === 1) {
        drawer?.StackPop(3);
      }
    }

    if (JSON.stringify(this.typeProducts[1]) !== JSON.stringify(filteredMainboards)) {
      this.typeProducts?.splice(1, 1, filteredMainboards);
    }
    if (JSON.stringify(this.typeProducts[3]) !== JSON.stringify(filteredRams)) {
      this.typeProducts?.splice(3, 1, filteredRams);
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
}

const store = useProductStore();

const isLoading = ref(true);
onMounted(async () => {
  isLoading.value = true;
  await productStore.fetchAllProducts();
  products.value = Products.getInstance(store);
  isLoading.value = false;
  callTestProxy();
});

const formatPrice = (price) => {
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ฿";
}

watchEffect(() => {
  console.log("🔄 Page : ", products.value?.getPage());
  products.value?.getProduct();
});

//Search
const searchQuery = ref('');
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return null;
  const result = productStore.allProducts2.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return result.length ? result : 0;
});

const ClearSearch = () => {
  searchQuery.value = "";
};

const Ready = ref(0);

watchEffect(() => {
  if (products.value) {
    Ready.value = 1;
  } else {
    Ready.value = 0;
  }
})

const items = [
  { title: 'Expensive', icon: mdiArrowUp },
  { title: 'Cheap', icon: mdiArrowDown },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

</script>

<style lang="scss" scoped>
// all main
.test{
  background-color: #141414;
}

.dark-mode .test{
  background-color: rgb(250, 250, 250) !important;
  color: black;
}

.sticky-total {
  position: sticky;
  top: 0;
  z-index: 1000;
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

.main-search {
  text-align: center;
  background-color: #FFFFFF;
  position: relative;
  top: 0;
  z-index: 1000;
  display: flex;
  padding: 10px 20px 10px 20px;
  flex-direction: row;
}

.dark-mode .main-search {
  background-color: #141414;
}

.block-filter {
  display: flex;
  margin-top: 30px;
}

// .dark-mode .main-search {
//   background-color: #141414 !important;
// }

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
  background-color: rgb(255, 255, 255) !important;
}

.dark-mode .search-container {
  background-color: #141414 !important;
}

.custom-search {
  background-color: #FFFFFF !important;
  color: black;
  width: 1000px;
  border: solid 1px rgb(5, 4, 4);
  border-radius: 30px;
}

.dark-mode .custom-search {
  background-color: #ffffff !important;
  color: rgb(0, 0, 0) !important;
}

.behide-search {
  background-color: transparent;
  border-radius: 30px;
}

.dark-mode .behide-search {
  background-color: #141414 !important;
}


.P_tag:hover {
  transform: translateX(-70%);
  transition: 1.5s ease-in-out;
}

.IMG_tag:hover {
  transform: scale(110%);
  transition: 0.3s ease;
}

.dark-mode .product-card {
  background-color: #ffffff !important;
  color: rgb(0, 0, 0) !important;
}

//Box Item
.item-Box {
  min-height: 70vh;
  margin-top: 20px;
  background-color: rgb(250, 250, 250);
  padding: 20px 20px 20px 20px;
}

.dark-mode .item-Box {
  background-color: #141414 !important;
  color: rgb(240, 238, 238) !important;
}

.product-card {
  min-height: 280px;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: #141414 !important;
  color: rgb(240, 238, 238) !important;
  border-radius: 15px;
  border: solid 2px #141414
}

.Titleinfo {
  font-size: 25px;
  transform: translateX(270px);
  margin-top: 10px;
}

// style="font-size: 25px; font-family: 'Kanit' sans-serif; transform: translateX(270px); margin-top: 10px;"

.Finfo {
  font-size: 18px;
  color: rgb(0, 0, 0);
}

.Sinfo {
  display: flex;
  flex-direction: column;
  // border: solid 2px red;
}

.F-Sinfo {
  display: flex;
  color: rgb(0, 0, 0);
  justify-content: space-evenly;
  font-size: 20px;
}

.S-Sinfo {
  transform: translateX(80px);
  font-size: 18px;
  // border: solid 2px green;
  // text-align: start ;
}

body,
.Finfo,
.F-Sinfo,
.S-Sinfo,
.Sinfo,
.Titleinfo {
  font-family: 'Kanit', sans-serif;
}


// .pdf{
//   width: 200px;
//   height: 10px;
//   background-color: black;
//   border: solid 2px red;
// }


.Fill-product {
  transform: translateY(0px);
  overflow-y: auto;
  // width: 300px !important;
  background-color: #FFFFFF !important;
  // border: solid 2px green;
}

.dark-mode .Fill-product {
  background-color: #141414 !important;
}

.Total {
  background-color: rgb(250, 250, 250) !important;
  color: black !important;
  // border: solid 2px #141414;
}

.block-product {
  display: flex;
  height: 50px;
  font-size: 15px;
  background-color: rgb(250, 250, 250) !important;
  color: #000000;
  align-items: center;
  // border: solid 2px #141414;
}
</style>
