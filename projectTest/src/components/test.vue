<template>
    <div> <!-- Root wrapper -->

        <!-- CPU Dropdown (Image on the left) -->
        <v-card class="Cpu">
            <div class="imgCpu">
                <img src="@/assets/CPU.png" class="animateImg" style="width: 320px; height: 200px;">
            </div>
            <div class="contentCpu">
                <div class="txtCpu">
                    <p>Function:</p>
                    <p>The CPU is the central processing unit of the computer that processes data and commands to make the computer function.</p>
                    <p>Importance:</p>
                    <p>The CPU is the brain of the computer, enabling all tasks to be performed according to user commands.</p>
                </div>
            </div>
        </v-card>

        <!-- Mainboard Dropdown (Image on the right) -->
        <v-card class="Main">
            <div class="contentMain">
                <div class="txtMain">
                    <p>Function:</p>
                    <p>The motherboard is the main circuit board that connects and manages the functions of all computer components, such as the CPU, RAM, and GPU.</p>
                    <p>Importance:</p>
                    <p>It serves as the base that connects all parts of the system, allowing the computer to function smoothly.</p>
                </div>
            </div>
            <div class="imgMain">
                <img src="@/assets/Mainboard.png" class="animateImg" style="width: 300px; height: 200px;">
            </div>
        </v-card>

        <!-- GPU Dropdown (Image on the left) -->
        <v-card class="Gpu">
            <div class="imgGpu">
                <img src="@/assets/Gpu.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <div class="contentGpu">
                <div class="txtGpu">
                    <p>Function:</p>
                    <p>The GPU is the graphics card responsible for processing images and graphics in the computer.</p>
                    <p>Importance:</p>
                    <p>It handles rendering 3D graphics and images, essential for tasks like gaming and high-end applications requiring detailed visuals.</p>
                </div>
            </div>
        </v-card>

        <!-- SSD Dropdown (Image on the right) -->
        <v-card class="Ssd">
            <div class="contentSsd">
                <div class="txtSsd">
                    <p>Function:</p>
                    <p>An SSD is a data storage device that uses flash memory to store data.</p>
                    <p>Importance:</p>
                    <p>An SSD significantly increases the speed of booting up the computer and loading programs compared to traditional hard drives (HDD).</p>
                </div>
            </div>
            <div class="imgSsd">
                <img src="@/assets/SSD.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
        </v-card>

        <!-- RAM Dropdown (Image on the left) -->
        <v-card class="Ram">
            <div class="imgRam">
                <img src="@/assets/Ram.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <div class="contentRam">
                <div class="txtRam">
                    <p>Function:</p>
                    <p>RAM is temporary memory used to store data that the computer is actively using.</p>
                    <p>Importance:</p>
                    <p>More RAM allows the computer to run multiple programs simultaneously without slowing down.</p>
                </div>
            </div>
        </v-card>

        <!-- Power Supply Dropdown (Image on the right) -->
        <v-card class="Power">
            <div class="contentPower">
                <div class="txtPower">
                    <p>Function:</p>
                    <p>The power supply unit provides electricity to all components of the computer.</p>
                    <p>Importance:</p>
                    <p>Without the power supply, the computer cannot function as it is the primary source of power.</p>
                </div>
            </div>
            <div class="imgPower">
                <img src="@/assets/Powersupply.png" class="animateImg" style="width: 325px; height: 225px;">
            </div>
        </v-card>

        <!-- Computer Case Dropdown (Image on the left) -->
        <v-card class="Case">
            <div class="imgCase">
                <img src="@/assets/Case.png" class="animateImg" style="width: 250px; height: 250px;">
            </div>
            <div class="contentCase">
                <div class="txtCase">
                    <p>Function:</p>
                    <p>The case is the enclosure that protects and houses the internal components of the computer.</p>
                    <p>Importance:</p>
                    <p>Besides protection, the case helps with cooling and airflow to prevent the system from overheating.</p>
                </div>
            </div>
        </v-card>

    </div> <!-- End div -->
</template>

<script setup>
import { ref } from 'vue';

// State variables removed as we no longer need toggle functionality
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
    justify-content: space-around;
    /* margin: 20px 20px 20px 20px; */
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
    justify-content: space-around;
    margin: 20px 20px 20px 0px;
    height: 300px;
    width: 1400px;
    align-items: center;
    transform: translateX(-220px);
    /* border: solid 1px red; */
}

/* .imgCpu,
.imgGpu,
.imgRam,
.imgCase {
    margin-right: 50px;
}

.imgMain,
.imgSsd,
.imgPower {
    margin-left: 50px;
}

.txtCpu,
.txtMain,
.txtGpu,
.txtRam,
.txtSsd,
.txtPower,
.txtCase {
    margin: 0 50px 0 20px;
    font-size: 20px;
}

.contentCpu,
.contentMain,
.contentGpu,
.contentRam,
.contentSsd,
.contentPower,
.contentCase {
    transform: translateY(-10px);
} */

.iconBtn {
    display: flex;
    align-items: center;
}
</style>
