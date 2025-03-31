<template>
  <v-container class="Body">
    <v-row style="display: flex; justify-content: center;">
      <v-col cols="8" style="display: flex; justify-content: center;">
        <h1 style="color: black;">Compare My Build</h1>
      </v-col>
      <!-- <v-col v-if="status" color="info" cols="4">
        Login Successful
      </v-col>
      <v-col v-else color="accent" cols="4">
        Login UnSuccessful
      </v-col> -->
    </v-row>

    <v-container class="blockCompare">
      <v-row class="Compare" no-gutters>
        <!-- Column 1 -->
        <template v-if="getStackDialogAt(0).status">
          <v-container class="ItemBox" style="margin: 0 30px 0 0;">
            <v-row style="font-size: 25px; display: flex; justify-content: center;">
              <h4 style="color: white; font-size: 25px;">Set I</h4>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn block color="#651FFF" dark @click="PopStackDialogAt(0)">
                  Drop
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="#FF9800" dark @click="ChangeStackDialogAt(0)">
                  Change
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(item, index) in getStackDialogObjectAt(0)" :key="index">
              <v-btn block :color="checkEqual(index) ? 'primary' : '#DD2C00'" height="70px" width="450px"
                style="display: flex; align-items: center; justify-content: start;" @click="swapIsSubObject(index)">
                <!-- รูปภาพและชื่อ -->
                <v-row class="d-flex" style=" width: 490px; height: 70px;">
                  <v-col cols="2" style="display: flex ;justify-content: start;">
                    <v-img :src="item.img" width="40px" height="40px" />
                  </v-col>
                  <v-col cols="10" class="d-flex align-center text-wrap">
                    {{ item.name }}
                  </v-col>
                </v-row>
              </v-btn>

              <!-- รายละเอียดเพิ่มเติม -->
              <v-row v-if="getIsSubObject(index)" class="d-flex flex-column" style="height: auto;">
                <v-col>
                  <v-card color="#E3F2FD" style="overflow-x: auto; display: flex; flex-direction: column;">
                    <div class="opsec1" style="display: flex;">
                      <h4 style="transform: translateX(40px);">Option</h4>
                      <h4 style="transform: translateX(200px);">Spec</h4>
                    </div>
                    <div class="info" style="width: 460px;">
                      <tbody>
                        <tr v-for="(value, key) in getStackDialogObjectAt(0)[index].additionalDetails" :key="key">
                          <p style="transform: translateX(10px); width: 180px;">{{ key }}</p>
                          <td style="transform: translateX(30px);">{{ value }}</td>
                        </tr>
                      </tbody>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </template>
        <template v-else>
          <v-col>
            <v-row style="display: flex; justify-content: center;width: 500px;">
              <h4 style="font-size: 25px ;">Product I</h4>
            </v-row>
            <v-row>
              <v-btn class="ItemBox" @click=" openItemDialog(0)">
                <svg-icon type="mdi" :path="mdiPlusCircle" size="50%" />
              </v-btn>
            </v-row>
          </v-col>
        </template>

        <!-- Column 2 -->
        <template v-if="getStackDialogAt(1).status">
          <v-container class="ItemBox">
            <v-row style="font-size: 25px; display: flex; justify-content: center;">
              <h4 style="color: white; font-size: 25px;">Set II</h4>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn block color="#651FFF" dark @click="PopStackDialogAt(1)">
                  Drop
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="#FF9800" dark @click="ChangeStackDialogAt(1)">
                  Change
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-for="(item, index) in getStackDialogObjectAt(1)" :key="index">
              <v-btn block :color="checkEqual(index) ? 'primary' : '#DD2C00'" height="70px" width="450px"
                style="display: flex; justify-content: start;" @click="swapIsSubObject(index)">
                <!-- รูปภาพและชื่อ -->
                <v-row class="d-flex" style=" width: 490px; height: 70px;">
                  <v-col cols="2" class="d-flex justify-center">
                    <v-img :src="item.img" width="40px" height="40px" />
                  </v-col>
                  <v-col cols="10" class="d-flex align-center text-wrap">
                    {{ item.name }}
                  </v-col>
                </v-row>
              </v-btn>

              <!-- รายละเอียดเพิ่มเติม -->
              <v-row v-if="getIsSubObject(index)" class="d-flex flex-column" style="height: auto;">
                <v-col >
                  <v-card color="#E3F2FD" style=" overflow-x: auto; display: flex; flex-direction: column;">
                    <div class="opsec" style="display: flex;">
                      <h4 style="transform: translateX(40px);">Option</h4>
                      <h4 style="transform: translateX(200px);">Spec</h4>
                    </div>
                    <div class="info" style="width: 460px; ">
                      <tbody style=" ">
                        <tr v-for="(value, key) in getStackDialogObjectAt(1)[index].additionalDetails" :key="key" >
                          <p style="transform: translateX(10px); width: 180px;">{{ key }}</p>
                          <td style="transform: translateX(30px);">{{ value }}</td>
                        </tr>
                      </tbody>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              
            </v-row>
          </v-container>
        </template>
        <template v-else>
          <v-col>
            <v-row style="display: flex; justify-content: center; width: 500px;">
              <h2 style="font-size: 25px;">Product II</h2> 
            </v-row>
            <v-row>
              <v-btn class="ItemBox" @click=" openItemDialog(1)">
                <svg-icon type="mdi" :path="mdiPlusCircle" size="50%" />
              </v-btn>
            </v-row>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <v-dialog v-model="isItemDialog" scrollable :overlay="false" class="DialogBox" transition="dialog-transition">
      <v-container style="overflow-y: auto;">
        <v-row>
          <v-col v-for="(item, index) in arrProduct" :key="index" cols="4">
            <!-- ตรวจสอบว่า selectedParts มีข้อมูลก่อนที่จะเข้าถึง -->
            <v-card v-if="!isOpenInfo[index].status" style="width: 300px; height: 400px; background-color: #141414;">
              <v-container>
                <v-row>
                  <v-col cols="6" style="color: white; font-size: 23px;">
                    Set {{ index + 1 }}
                  </v-col>
                  <v-col cols="6">
                    <v-btn block color="#4CAF50" class="elevation-10" @click="swapIsOpenInfo(index)" style="height: 35px;">
                      Info
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <button>
                <v-container width="300px" height="400px" @click="AddStackDialogAt(StrategyStep(), arrProduct[index])">
                  <v-row>
                    <v-col cols="4">
                      <v-img :src="item.Cpu.img" />
                    </v-col>
                    <v-col cols="4">
                      <v-img :src="item.Gpu.img" />
                    </v-col>
                    <v-col cols="4">
                      <v-img :src="item.Mainboard.img" />
                    </v-col>
                    <v-col cols="4">
                      <v-img :src="item.Ram.img" />
                    </v-col>
                    <v-col cols="4">
                      <v-img :src="item.Psu.img" />
                    </v-col>
                    <v-col cols="4">
                      <v-img :src="item.M2.img" />
                    </v-col>
                    <v-col cols="4" />
                    <v-col cols="4">
                      <v-img :src="item.Case.img" />
                    </v-col>
                  </v-row>
                </v-container>
              </button>
            </v-card>
            <button v-else style="width: 300px; height: auto; background-color: cadetblue;">
              <v-container style="background-color: #141414;">
                <v-row>
                  <v-col cols="6" style="font-size: 23px; color: white; transform: translateX(-40px);">
                      Set {{ index + 1 }}
                  </v-col>
                  <v-col cols="6">
                    <v-btn block color="#FF5722" @click="swapIsOpenInfo(index)">
                      Exit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container style="height: auto; background-color: #141414;">
                <v-row style="width: 290px;">
                  <v-card block color="#E3F2FD" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Cpu.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#BBDEFB" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Gpu.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#E3F2FD" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Mainboard.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#BBDEFB" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Ram.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#E3F2FD" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Psu.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#BBDEFB" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.M2.name) }}
                  </v-card>
                </v-row>
                <v-row style="width: 290px;">
                  <v-card block color="#E3F2FD" style="width:99%; height: 80px; display: flex; align-items: center;">
                    {{ Utility.cleanNameItem(item.Case.name) }}
                  </v-card>
                </v-row>
              </v-container>
            </button>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, reactive } from 'vue'
import { useRouter } from 'vue-router';
import axios from "axios";
import SvgIcon from "@jamescoyle/vue-icon";
//import additional
import { mdiPlusCircle } from '@mdi/js';
import { useUtility } from '@/stores/Utility';
// import class
import authService from "@/services/AuthService";
import { useProductStore } from '@/stores/ProductStore';
const useProduct = useProductStore();
const Utility = useUtility();


//Variable
const isItemDialog = ref(false);
const currentStep = ref('one');

//router
const router = useRouter();

//Variable user
const profileImage = ref("");
const isVisit = ref(false);
const username = ref("");
const email = ref("");
//event
onMounted(async () => {
  await loadUserFromServer();
  await fetchUserBuild(email.value);
  if (!isVisit.value) {
    router.push('/');
  }
});
// Function
const status = ref("")
const loadUserFromServer = async () => {
  try {
    const user = await authService.loadUserFromServer();
    if (user) {
      isVisit.value = true;
      username.value = user.username;
      email.value = user.email;
      profileImage.value = user.profileImage || "";
      status.value = user.status
    }
  } catch (error) {
    alert("Please Login again");
    isVisit.value = false;
  }
};



const BuildCollection = ref([]);

//fetch
const fetchUserBuild = async (email) => {
  try {

    const response = await axios.get(
      `http://localhost:5000/api/setcomputer/user-builds?userEmail=${encodeURIComponent(email)}`
    );

    BuildCollection.value = response.data.data.map(item => {
      return {
        selectedParts: item.selectedParts,
        userEmail: item.userEmail,
        createdAt: item.createdAt,
      };
    });

    // console.log('User build data:', BuildCollection.value);
    // console.log(BuildCollection.value[0].selectedParts.caseId);
  } catch (err) {
    console.error('Error fetching user build:', err.message);
  }

  if (BuildCollection.value && BuildCollection.value.length > 0) {
    for (let i = 0; i < BuildCollection.value.length; i++) {
      getProduct(i);
      console.log(arrProduct.value[i].Cpu ?? 'N/A')
    }
  } else {
    console.log('BuildCollection is not loaded yet');
  }
};

const arrProduct = ref([]);

function getProduct(index) {
  if (BuildCollection.value[index] && BuildCollection.value[index].selectedParts) {
    const cpuId = BuildCollection.value[index].selectedParts.cpuId;
    const gpuId = BuildCollection.value[index].selectedParts.gpuId;
    const mainboardId = BuildCollection.value[index].selectedParts.mainboardId;
    const ramId = BuildCollection.value[index].selectedParts.ramId;
    const psuId = BuildCollection.value[index].selectedParts.psuId;
    const m2Id = BuildCollection.value[index].selectedParts.m2Id;
    const caseId = BuildCollection.value[index].selectedParts.caseId;
    // const ID = b

    // ตรวจสอบว่า allProducts.value[0] เป็น array และค้นหาด้วย _id
    if (Array.isArray(useProduct.allProducts[0])) {
      const matchedCPU = useProduct.allProducts[0].find(product => product._id === cpuId);
      const matchedGPU = useProduct.allProducts[1].find(product => product._id === gpuId);
      const matchedMAINBOARD = useProduct.allProducts[2].find(product => product._id === mainboardId);
      const matchedRAM = useProduct.allProducts[3].find(product => product._id === ramId);
      const matchedPSU = useProduct.allProducts[4].find(product => product._id === psuId);
      const matchedM2 = useProduct.allProducts[5].find(product => product._id === m2Id);
      const matchedCASE = useProduct.allProducts[6].find(product => product._id === caseId);
      arrProduct.value.push({
        Cpu: matchedCPU,
        Gpu: matchedGPU,
        Mainboard: matchedMAINBOARD,
        Ram: matchedRAM,
        Psu: matchedPSU,
        M2: matchedM2,
        Case: matchedCASE,
      });
      // console.log("Matched product: ", arrProduct.value);
      // console.log("CaseId from selectedParts: ", cpuId);
      // console.log("Product _id: ", useProduct.allProducts[0].map(product => product._id)); // ดูว่า _id ใน allProducts[0] เป็นอะไร

    } else {
      console.log("allProducts[0] is not an array.");
    }
  } else {
    console.log("Selected parts or BuildCollection[index] is undefined.");
  }
}

//subdetailObject
const isSubObject = ref([false, false, false, false, false, false, false]);

function swapIsSubObject(index) {
  console.log('Before Swap: ', isSubObject.value[index]);
  isSubObject.value[index] = !isSubObject.value[index];
  for (let i = 0; i < isSubObject.value.length; i++) {
    if (isSubObject.value[i] === true && i !== index) {
      isSubObject.value[i] = false;
    }
  }
  console.log('After Swap: ', isSubObject.value[index]);
}

function getIsSubObject(index) {
  // console.log("getStackDialogObjectAt(0).additionalDetails :", getStackDialogObjectAt(0)[0].additionalDetails)
  return isSubObject.value[index];
}

//Info
const isOpenInfo = ref(Array.from({ length: arrProduct.value.length }, () => ({
  status: false,
})));

function swapIsOpenInfo(index) {
  isOpenInfo.value[index].status = !isOpenInfo.value[index].status;
}

watch(() => arrProduct.value.length, async (newLength) => {
  await nextTick();
  isOpenInfo.value = Array.from({ length: newLength }, () => ({ status: false }));
});

//Array Stack
const StackDialog = reactive(Array.from({ length: 2 }, () => ({
  status: false,
  object: [],
})));

function PopStackDialogAt(index) {
  StackDialog[index] = {
    status: false,
    object: [],
  }
  if (index === 0) {
    setStep('one');
  } else if (index === 1) {
    setStep('two');
  }

  for (let i = 0; i < isSubObject.value.length; i++) {
    isSubObject.value[i] = false;
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
  }
  if (index === 0) {
    setStep('one');
  } else if (index === 1) {
    setStep('two');
  }
  console.log("Full object details: ", JSON.stringify(StackDialog[index].object, null, 2));

  isItemDialog.value = false;

  console.log(`CurrentStep: ${getStep()}`);
  console.log(`StackDialog[${index}]: ${StackDialog[index].status}`);
  console.log(`Stack [${index}] ${StackDialog[index].status} , ${StackDialog[index].object ?? undefined} `)
}


function getStackDialogAt(index) {
  return StackDialog[index];
}

function getStackDialogObjectAt(index) {
  const stackDialogAtIndex = getStackDialogAt(index)?.object;  // ตรวจสอบว่า object มีอยู่
  if (!stackDialogAtIndex) return [];  // ถ้าไม่พบให้คืนค่าเป็น array ว่าง

  const cpu = stackDialogAtIndex.Cpu;
  const gpu = stackDialogAtIndex.Gpu;
  const mb = stackDialogAtIndex.Mainboard;
  const ram = stackDialogAtIndex.Ram;
  const psu = stackDialogAtIndex.Psu;
  const m2 = stackDialogAtIndex.M2;
  const cases = stackDialogAtIndex.Case;

  const array = [cpu, gpu, mb, ram, psu, m2, cases];

  console.log("Size : ", array.length);
  return array;
}

// checkEqual
function checkEqual(index) {
  const stackObj1 = getStackDialogObjectAt(0);
  const stackObj2 = getStackDialogObjectAt(1);

  if (index >= 0 && index < stackObj1.length && index < stackObj2.length) {
    if (stackObj1[index] && stackObj2[index]) {
      if (stackObj1[index].name === stackObj2[index].name) {
        return true;
      }
    } else if (stackObj1[index] && !stackObj2[index]) {
      return true;
    } else if (!stackObj1[index] && stackObj2[index]) {
      return true;
    }
  }
  return false;
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
  min-width: 80%;
  height: 800px;
  background-color: #ffffff;
  color: black;
  // border: solid 2px black;
  overflow-y: auto;
}

.ImageBox {
  width: 150px;
  height: 150px;
  background-color: #E8EAF6;
}

.ItemBox {
  width: 500px;
  min-height: 500px;
  background-color: #000000;
  overflow-y: auto;
  text-align: start;
  padding-top: 20px;
}

.DialogBox {
  width: 90%;
  min-height: 90%;
  background-color: rgb(248, 248, 248);
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

.text-wrap {
  white-space: normal;
  /* ทำให้ข้อความสามารถขึ้นบรรทัดใหม่ได้ */
  word-wrap: break-word;
  /* ตัดคำที่ยาวเกินไปให้อยู่ในบรรทัดใหม่ */
}

.blockCompare{
  display: flex;
  // border: solid 2px blue;
  justify-content: space-between;
}

.Compare{
  display: flex;
  flex-direction: row;
  margin: 20px 0 0 50px;
  height: 600px;
}
</style>
