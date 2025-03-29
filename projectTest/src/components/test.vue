<template>
    <div> <!-- Root wrapper -->

        <!-- CPU Dropdown (Image on the left) -->
        <v-card class="Cpu">
            <div class="imgCpu">
                <img src="@/assets/CPU.png" class="animateImg" style="width: 320px; height: 200px;">
            </div>
            <v-btn @click="toggleCpu" class="iconBtn">
                CPU Info
                <v-icon right>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the right -->
            </v-btn>
            <v-expand-transition>
                <div v-show="isCpuVisible" class="contentCpu">
                    <div class="txtCpu">
                        <p>Function:</p>
                        <p>The CPU is the central processing unit of the computer that processes data and commands to
                            make the computer function.</p>
                        <p>Importance:</p>
                        <p>The CPU is the brain of the computer, enabling all tasks to be performed according to user
                            commands.</p>
                    </div>
                </div>
            </v-expand-transition>
        </v-card>

        <!-- Mainboard Dropdown (Image on the right) -->
        <v-card class="Main">
            <v-btn @click="toggleMain" class="iconBtn">
                <v-icon left>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the left -->
                Mainboard Info
            </v-btn>
            <v-expand-transition>
                <div v-show="isMainVisible" class="contentMain">
                    <div class="txtMain">
                        <p>Function:</p>
                        <p>The motherboard is the main circuit board that connects and manages the functions of all
                            computer components, such as the CPU, RAM, and GPU.</p>
                        <p>Importance:</p>
                        <p>It serves as the base that connects all parts of the system, allowing the computer to
                            function smoothly.</p>
                    </div>
                </div>
            </v-expand-transition>
            <div class="imgMain">
                <img src="@/assets/Mainboard.png" class="animateImg" style="width: 300px; height: 200px;">
            </div>
        </v-card>

        <!-- GPU Dropdown (Image on the left) -->
        <v-card class="Gpu">
            <div class="imgGpu">
                <img src="@/assets/Gpu.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <v-btn @click="toggleGpu" class="iconBtn">
                GPU Info
                <v-icon right>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the right -->
            </v-btn>
            <v-expand-transition>
                <div v-show="isGpuVisible" class="contentGpu">
                    <div class="txtGpu">
                        <p>Function:</p>
                        <p>The GPU is the graphics card responsible for processing images and graphics in the computer.
                        </p>
                        <p>Importance:</p>
                        <p>It handles rendering 3D graphics and images, essential for tasks like gaming and high-end
                            applications requiring detailed visuals.</p>
                    </div>
                </div>
            </v-expand-transition>
        </v-card>

        <!-- SSD Dropdown (Image on the right) -->
        <v-card class="Ssd">
            <v-btn @click="toggleSsd" class="iconBtn">
                SSD Info
                <v-icon right>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the right -->
            </v-btn>
            <v-expand-transition>
                <div v-show="isSsdVisible" class="contentSsd">
                    <div class="txtSsd">
                        <p>Function:</p>
                        <p>An SSD is a data storage device that uses flash memory to store data.</p>
                        <p>Importance:</p>
                        <p>An SSD significantly increases the speed of booting up the computer and loading programs
                            compared to traditional hard drives (HDD).</p>
                    </div>
                </div>
            </v-expand-transition>
            <div class="imgSsd">
                <img src="@/assets/SSD.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
        </v-card>

        <!-- RAM Dropdown (Image on the left) -->
        <v-card class="Ram">
            <div class="imgRam">
                <img src="@/assets/Ram.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <v-btn @click="toggleRam" class="iconBtn">
                <v-icon left>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the left -->
                RAM Info
            </v-btn>
            <v-expand-transition>
                <div v-show="isRamVisible" class="contentRam">
                    <div class="txtRam">
                        <p>Function:</p>
                        <p>RAM is temporary memory used to store data that the computer is actively using.</p>
                        <p>Importance:</p>
                        <p>More RAM allows the computer to run multiple programs simultaneously without slowing down.
                        </p>
                    </div>
                </div>
            </v-expand-transition>
        </v-card>

        <!-- Power Supply Dropdown (Image on the right) -->
        <v-card class="Power">
            <v-btn @click="togglePower" class="iconBtn">
                <v-icon left>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the left -->
                Power Supply Info
            </v-btn>
            <v-expand-transition>
                <div v-show="isPowerVisible" class="contentPower">
                    <div class="txtPower">
                        <p>Function:</p>
                        <p>The power supply unit provides electricity to all components of the computer.</p>
                        <p>Importance:</p>
                        <p>Without the power supply, the computer cannot function as it is the primary source of power.
                        </p>
                    </div>
                </div>
            </v-expand-transition>
            <div class="imgPower">
                <img src="@/assets/Powersupply.png" class="animateImg" style="width: 325px; height: 225px;">
            </div>
        </v-card>

        <!-- Computer Case Dropdown (Image on the left) -->
        <v-card class="Case">
            <div class="imgCase">
                <img src="@/assets/Case.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <v-btn @click="toggleCase" class="iconBtn">
                <v-icon left>mdi-arrow-down-drop-circle</v-icon> <!-- Icon on the left -->
                Case Info
            </v-btn>
            <v-expand-transition>
                <div v-show="isCaseVisible" class="contentCase">
                    <div class="txtCase">
                        <p>Function:</p>
                        <p>The case is the enclosure that protects and houses the internal components of the computer.
                        </p>
                        <p>Importance:</p>
                        <p>Besides protection, the case helps with cooling and airflow to prevent the system from
                            overheating.</p>
                    </div>
                </div>
            </v-expand-transition>
        </v-card>

    </div> <!-- End div -->
</template>

<script setup>
import { ref } from 'vue';

// State variables to control visibility of each dropdown
const isCpuVisible = ref(false);
const isMainVisible = ref(false);
const isGpuVisible = ref(false);
const isRamVisible = ref(false);
const isSsdVisible = ref(false);
const isPowerVisible = ref(false);
const isCaseVisible = ref(false);

// Functions to toggle the visibility of each dropdown
const toggleCpu = () => {
    isCpuVisible.value = !isCpuVisible.value;
};

const toggleMain = () => {
    isMainVisible.value = !isMainVisible.value;
};

const toggleGpu = () => {
    isGpuVisible.value = !isGpuVisible.value;
};

const toggleRam = () => {
    isRamVisible.value = !isRamVisible.value;
};

const toggleSsd = () => {
    isSsdVisible.value = !isSsdVisible.value;
};

const togglePower = () => {
    isPowerVisible.value = !isPowerVisible.value;
};

const toggleCase = () => {
    isCaseVisible.value = !isCaseVisible.value;
};
</script>

<style scoped>
body,
p {
    font-family: 'Kanit', sans-serif;
}

.animateImg {
    opacity: 0;
    animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.Main,
.Ssd,
.Power {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px 20px 20px;
    height: 300px;
    width: 1400px;
    align-items: center;
    transform: translateX(-30px);
}

.Cpu,
.Gpu,
.Ram,
.Case {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px 20px 0px;
    height: 300px;
    width: 1400px;
    align-items: center;
    transform: translateX(-220px);
}

.imgCpu,
.imgGpu,
.imgRam,
.imgCase {
    margin-right: 50px;
    /* รูปภาพอยู่ทางขวา */
}

.imgMain,
.imgSsd,
.imgPower {
    margin-left: 50px;
    /* รูปภาพอยู่ทางซ้าย */
}

.txtCpu,
.txtMain,
.txtGpu,
.txtRam,
.txtSsd,
.txtPower,
.txtCase {
    margin: 0 50px 0 0;
    font-size: 20px;
}

.contentCpu,
.contentMain,
.contentGpu,
.contentRam,
.contentSsd,
.contentPower,
.contentCase {
    margin-top: 10px;
}

.iconBtn {
    display: flex;
    align-items: center;
}
</style>