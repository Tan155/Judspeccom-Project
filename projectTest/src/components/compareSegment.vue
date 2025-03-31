<template>
  <v-container class="Body">
    <template v-if="isLoading">
      <v-container class="blockCompare">
        <v-progress-circular :size="130" :width="12" color="primary" indeterminate
          style="transform: translateY(-20vh);" />
      </v-container>
    </template>
    <template v-else>
      <template v-if="!isLoading">
        <h1 style="color: black; transform: translateX(350px);">
          Compare Segment Computer
        </h1>
        <v-sheet class="mx-auto mt-2" max-width="100%">
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="(item, index) in useProduct?.Menu" :key="index">
              <v-btn :color="getCurrentMenu() === index ? 'primary' : undefined" class="ma-2 text-start" rounded
                @click="() => { setCurrentMenu(index); }">
                <svg-icon type="mdi" :path="item?.icon" />
                {{ item?.name }}
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </template>
      <div>
        <v-container>
          <v-row justify="center" align="center" class="text-center" no-gutters>
            <!-- Column 1 -->
            <template v-if="getStackDialogAt(0).status">
              <v-col cols="12" md="6" class="text-center">
                <h2>Product I</h2>
                <v-container class="ItemBox">
                  <v-row>
                    <v-col cols="4">
                      <v-card style="width: 150px; height: 150px;">
                        <v-img :src="getStackDialogAt(0)?.object?.img" style="width: 150px; height: 150px;" />
                      </v-card>
                    </v-col>
                    <v-col cols="8">
                      <v-container>
                        <v-row>
                          <div class="name1" style="font-size: 18px; color: white;">
                            <p>{{ Utility.cleanNameItem(getStackDialogAt(0).object.name) }}</p>
                          </div>
                        </v-row>
                        <v-row>
                          <div class="price1">
                            <p style="font-size: 18px; color: white;">
                              {{ Utility.formatPrice(getStackDialogAt(0).object.price) }}
                            </p>
                          </div>
                        </v-row>
                        <v-row>
                          <v-btn color="#FF5722" block @click="ChangeStackDialogAt(0)">
                            Change
                          </v-btn>
                        </v-row>
                        <v-row>
                          <v-btn style="margin-top: 10px;" color="#EF5350" block @click="PopStackDialogAt(0)">
                            Delete
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                  <v-row>
                    <div class="info1" style="width: 500px; overflow-x: auto; color: white; font-size: 16px;">
                      <thead>
                        <th>Option</th>
                        <th style="transform: translateX(-20px);">
                          Spec
                        </th>
                      </thead>
                      <tbody>
                        <tr v-for="(value, key) in getStackDialogAt(0).object.additionalDetails" :key="key">
                          <td style="transform:  translateX(10px);">
                            {{ key }}
                          </td>
                          <td style="transform: translateX(35px);">
                            {{ value }}
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </v-row>
                </v-container>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" md="6" class="text-center">
                <h2>Product I</h2>
                <v-btn class="ItemBox" @click=" openItemDialog(0)">
                  <svg-icon type="mdi" :path="mdiPlusCircle" size="70%" />
                  <!-- <h2>Add first!</h2> -->
                </v-btn>
              </v-col>
            </template>


            <!-- Column 2 -->
            <template v-if="getStackDialogAt(1).status">
              <v-col cols="12" md="6" class="text-center">
                <h2>Product II</h2>
                <v-container class="ItemBox">
                  <v-row>
                    <v-col cols="4">
                      <v-card style="width: 150px; height: 150px;">
                        <v-img :src="getStackDialogAt(1)?.object?.img" style="width: 150px; height: 150px;" />
                      </v-card>
                    </v-col>
                    <v-col cols="8">
                      <v-container>
                        <v-row>
                          <div class="name2" style="font-size: 18px; color: white;">
                            <p>{{ Utility.cleanNameItem(getStackDialogAt(1).object.name) }}</p>
                          </div>
                        </v-row>
                        <v-row>
                          <div class="price2" style="font-size: 18px; color: white;">
                            <p style="font-size: 20px;">
                              {{ Utility.formatPrice(getStackDialogAt(1).object.price) }}
                            </p>
                          </div>
                        </v-row>
                        <v-row>
                          <v-btn color="#FF5722" block @click="ChangeStackDialogAt(1)">
                            Change
                          </v-btn>
                        </v-row>
                        <v-row>
                          <v-btn color="#EF5350" style="margin-top: 10px;" block @click="PopStackDialogAt(1)">
                            Delete
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                  <v-row>
                    <div class="info2" style="width: 500px; overflow-x: auto; color: white; font-size: 16px;">
                      <thead>
                        <th>Option</th>
                        <th style="transform: translateX(-20px);">
                          Spec
                        </th>
                      </thead>
                      <tbody>
                        <tr v-for="(value, key) in getStackDialogAt(1).object.additionalDetails" :key="key">
                          <td style="transform:  translateX(10px);">
                            {{ key }}
                          </td>
                          <td style="transform: translateX(35px);">
                            {{ value }}
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </v-row>
                </v-container>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" md="6" class="text-center">
                <h2>Product II</h2>
                <v-btn class="ItemBox" @click="openItemDialog(1)">
                  <svg-icon type="mdi" :path="mdiPlusCircle" size="70%" />
                  <h2 />
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </div>
      <v-dialog v-model="isItemDialog" scrollable :overlay="false" class="DialogBox" transition="dialog-transition">
        <v-container v-if="!isLoading && getCurrentMenu() >= 0" style="overflow-y: auto;">
          <v-row>
            <v-col v-for="(item, index) in currentProductList" :key="index" cols="3">
              <button class="eachItem" @click="AddStackDialogAt(StrategyStep(), item)">
                <v-img :src="item?.img" width="100%" />
                <v-container style=" min-height: 85px ">
                  <v-row>
                    <p style="font-size: 14px; text-align: start;">
                      {{ Utility.cleanNameItem(item?.name) }}
                    </p>
                  </v-row>
                  <v-row>
                    <h1 style="font-size: 18px;">
                      {{ Utility.formatPrice(item?.price) }}
                    </h1>
                  </v-row>
                </v-container>
              </button>
            </v-col>
          </v-row>
        </v-container>
      </v-dialog>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick, watchEffect, reactive } from 'vue'
import SvgIcon from "@jamescoyle/vue-icon";
//class
import { useProductStore } from '@/stores/ProductStore';
import { useUtility } from '@/stores/Utility';
//import additional
import { mdiImageOffOutline, mdiTextLong, mdiPlusCircle } from '@mdi/js';
//start Pinia
const useProduct = useProductStore();
const Utility = useUtility();

//Variable
const isLoading = ref(false);
const isItemDialog = ref(false);
const currentMenu = ref(0);
const stepCheck = ['one', 'two'];
const currentStep = ref('one');

//Array
const currentProductList = ref([]);
watchEffect(async () => {
  const index = getCurrentMenu();
  const data = await useProduct.getArrayProductAt(index);
  currentProductList.value = data;
});

//Event
onMounted(async () => {
  isLoading.value = true;
  try {
    await useProduct.fetchAllProducts();
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (useProduct.allProducts.value && useProduct.allProducts.value.length > 0) {
      console.log("Products loaded:", useProduct.allProducts.value);
      isLoading.value = false;
    } else {
      console.info("No products available.");
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    isLoading.value = false;
  }
});

const StackDialog = reactive(Array.from({ length: 2 }, () => ({
  status: false,
  object: [],
})));

function PopStackDialogAt(index) {
  StackDialog[index] = {
    status: false,
    object: [],
    type: undefined,
  }
  if (index === 0) {
    setStep('one');
  } else if (index === 1) {
    setStep('two');
  }
}

function ChangeStackDialogAt(index) {
  if (index === 0) {
    setStep('one');
  } else if (index === 1) {
    setStep('two');
  }
  isItemDialog.value = true;
}

function AddStackDialogAt(index, object) {
  StackDialog[index] = {
    status: true,
    object: object,
    type: useProduct?.getMenuAt(getCurrentMenu()),
  }

  if (index === 0) {
    if (StackDialog[index].type !== StackDialog[1].type && StackDialog[1].type !== undefined) {
      PopStackDialogAt(1);
    }
  } else if (index === 1) {
    if (StackDialog[index].type !== StackDialog[0].type && StackDialog[0].type !== undefined) {
      PopStackDialogAt(0);
    }
  }
  isItemDialog.value = false;

  console.log(`CurrentStep: ${getStep()}`);
  console.log(`StackDialog[${index}]: ${StackDialog[index].status}`);
  console.log(`Stack [${index}] ${StackDialog[index].status} , ${StackDialog[index].object.name ?? undefined} `)
}

function getStackDialogAt(index) {
  return StackDialog[index];
}

// Methods
const openItemDialog = (index) => {
  nextTick(() => {
    isItemDialog.value = true;
    if (index === 0) {
      setStep('one');
    } else if (index === 1) {
      setStep('two');
    }
  })
};

function setCurrentMenu(newMenu) {
  currentMenu.value = newMenu;
  console.info(`currentMenu : ${currentMenu?.value ?? 0}`);
}

function getCurrentMenu() {
  return currentMenu?.value ?? 0;
}

function getStep() {
  return currentStep.value;
}

function setStep(newStep) {
  return currentStep.value = newStep;
}

function StrategyStep() {
  if (getStep() === 'one') {
    return 0;
  } else if (getStep() === 'two') {
    return 1;
  }
}


</script>


<style lang="scss" scoped>
.Body {
  width: 2000px;
  height: 1000px;
  background-color: #ffffff;
  color: black;
}

.ImageBox {
  width: 150px;
  height: 150px;
  background-color: #E8EAF6;
}

.blockCompare {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ItemBox {
  // display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 520px;
  height: 700px;
  background-color: black;
  overflow-y: auto;
  text-align: start;
  // margin-left: 30px;
}

.DialogBox {
  width: 70%;
  min-height: 70%;
  background-color: #304FFE;
  margin-top: 50px;
}

.eachItem {
  padding: 2px;
  width: 180px;
  min-height: 240px;
  border-radius: 8px;
  background-color: #1A237E;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 3px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.v-col {
  padding: 10px;
  /* เพิ่ม padding สำหรับแต่ละคอลัมน์ */
}
</style>
