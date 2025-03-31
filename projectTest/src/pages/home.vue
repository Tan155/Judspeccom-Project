<template>
  <v-container fluid class="pa-0">
    <!-- ✅ พื้นหลังเคลื่อนไหวและเบลอตามการเลื่อน -->
    <div ref="background" class="background-container">
      <div class="content">
        <h1>Welcome to Judpeccom!</h1>
        <p>We will help you build your dream computer.</p>
        <v-btn text to="/toolV1" color="primary" class="start-btn">
          Let's Start It
        </v-btn>
      </div>
    </div>

    <!-- ✅ แถบเลื่อนภาพที่มีพื้นหลัง -->
    <div class="slider-container">
      <div class="slider">
        <div class="slider-wrapper">
          <div class="spacer" />
          <img v-for="(image, index) in images" :key="index" :src="image" class="slider-item">
          <div class="spacer" />
        </div>
      </div>
    </div>

    <div ref="knowledgeSection" class="after-slider-content">
      <h2>KNOWLAGE ABOUT COMPUTER</h2>
    </div>

    <v-container style="transform: translateY(-150px);">
      <test />
    </v-container>

    <!-- ✅ ลูกศรแอนิเมชันที่เคลื่อนไหว -->
    <div ref="arrow" class="arrow-container" @click="scrollToKnowledgeSection">
      <div class="arrow" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import test from "@/components/test.vue";

const images = ref([
  new URL("@/assets/amd.png", import.meta.url).href,
  new URL("@/assets/asus.png", import.meta.url).href,
  new URL("@/assets/corsair.png", import.meta.url).href,
  new URL("@/assets/gigaby.png", import.meta.url).href,
  new URL("@/assets/intel.png", import.meta.url).href,
  new URL("@/assets/msi.png", import.meta.url).href,
  new URL("@/assets/nvidia.png", import.meta.url).href,
  new URL("@/assets/seagate.png", import.meta.url).href,
  new URL("@/assets/WD.png", import.meta.url).href,
]);

const background = ref(null);
const arrow = ref(null);

// ฟังก์ชันสำหรับการเลื่อนหน้าไปยังส่วนที่ต้องการ
const knowledgeSection = ref(null);

const scrollToKnowledgeSection = () => {
  if (knowledgeSection.value) {
    knowledgeSection.value.scrollIntoView({
      behavior: 'smooth', // การเลื่อนอย่างนุ่มนวล
      block: 'start',     // เริ่มที่ตำแหน่งเริ่มต้นของส่วน
    });
  }
};

// คำนวณการเบลอเมื่อ scroll
onMounted(() => {
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // การเบลอสำหรับพื้นหลังและลูกศร
    let blurAmount = Math.min(scrollY * 0.05, 10);

    if (scrollY < 500) {
      blurAmount = 0; // ตั้งการเบลอเป็น 0 ถ้า scroll ไม่ถึงตำแหน่งที่ต้องการ
    }

    // การเบลอสำหรับพื้นหลัง
    if (background.value) {
      background.value.style.filter = `blur(${blurAmount}px)`;
    }

    // การเบลอสำหรับลูกศร
    if (arrow.value) {
      arrow.value.style.filter = `blur(${blurAmount}px)`;
    }
  });
});
</script>

<style scoped>
/* ✅ พื้นหลังเต็มหน้าจอ */
.background-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('https://images.pexels.com/photos/18295020/pexels-photo-18295020/free-photo-of-keyboard-mouse-and-controller-near-monitor.jpeg');
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease, filter 0.3s ease;
  transform: translateY(-7vh);
}

/* ใช้ฟอนต์ Kanit */
body,
.v-btn,
.v-col,
.content,
h1,
h2,
p {
  font-family: 'Kanit', sans-serif;
}

.content {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.v-btn.start-btn {
  font-size: 1.5em;
  padding: 3px 30px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  min-width: 200px;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 20px;
}

/* เปลี่ยนสีพื้นหลังเมื่อ hover */
.v-btn.start-btn:hover {
  background-color: #0056b3;
}

/* ตั้งค่าพื้นที่ของ Slider */
.slider-container {
  width: 100vw;
  height: 100px;
  overflow: hidden;
  position: relative;
  background-color: #555555;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -67px;
  /* เลื่อนขึ้น 50px */
}

.slider {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
}

.slider-wrapper {
  display: flex;
  gap: 30px;
  padding: 0 10px;
  width: max-content;
  animation: scroll 20s linear infinite;
  transition: transform 0.3s ease-in-out;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.spacer {
  width: 50px;
}

.slider-item {
  width: 110px;
  height: 110px;
  object-fit: contain;
  flex-shrink: 0;
}

.slider-wrapper:hover {
  animation-play-state: paused;
}

/* ✅ ปรับขนาดสำหรับหน้าจอมือถือ */
@media (max-width: 600px) {
  .slider-item {
    width: 80px;
    height: 80px;
  }

  .slider-wrapper {
    gap: 15px;
  }

  .spacer {
    width: 30px;
  }
}

/* เพิ่มลูกศรแอนิเมชันที่เคลื่อนไหว */
.arrow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 3200px;
  width: 100%;
  cursor: pointer;
  /* เปลี่ยนเป็น cursor pointer เมื่อ hover */
}

.arrow {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 40px solid white;
  animation: bounce 2s infinite ease-in-out;
}

/* สร้างแอนิเมชันการกระโดด */
@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* เพิ่มข้อความหลังจาก slider */
.after-slider-content {
  text-align: center;
  margin-top: 50px;
  color: white;
}

.after-slider-content h2 {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Kanit', sans-serif;
}
</style>
