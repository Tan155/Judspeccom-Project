<template>
  <v-app :class="{ 'dark-mode': isDarkMode }">
    <!-- NAVBAR -->
    <v-app-bar fixed flat elevation="0" height="65"
      style="z-index: 9999; position: fixed; top: 0; left: 0; width: 100%; background-color: black; padding-bottom: 5px;">
      <v-container class="fill-width" style="max-width: none;">
        <v-row align="center" justify="space-between" class="fill-width" style="width: 100%;">
          <!-- Home Button (ซ้ายสุด) -->
          <v-col cols="auto">
            <v-img src="@/assets/logo1.png" alt="Home Logo" width="150" height="auto" @click="goHome" />
          </v-col>

          <v-col v-if="!isRegisterOrLoginPage" class="d-flex justify-center">
            <v-btn text to="/" class="text-h5">
              Home
            </v-btn>
            <v-btn text to="/toolV1" class="text-h5">
              Customize
            </v-btn>
            <v-btn text to="/LabCompare" class="text-h5">
              Compare
            </v-btn>
          </v-col>

          <v-btn icon class="ml-2" @click="toggleTheme">
            <v-icon>{{ isDarkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
          </v-btn>

          <v-col cols="auto" class="d-flex justify-end">
            <v-menu v-if="!isLoggedIn">
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props" class="text-h5">
                  Register
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <!-- Register -->
                  <v-list-item-title>
                    <v-btn prepend-icon="mdi-account" class="text-h6" @click="register">
                      Register
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
                <!-- Login -->
                <v-list-item>
                  <v-list-item-title>
                    <v-btn prepend-icon="mdi-login" class="text-h6" @click="login">
                      Login
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- User and Logout -->
            <v-menu v-if="isLoggedIn && status === 'Customer'">
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props">
                  <v-avatar size="32" class="mr-2">
                    <v-img :src="profileImage" alt="Profile" />
                  </v-avatar>
                  {{ username }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn prepend-icon="mdi-account" class="text-h6" @click="myProfile">
                    My Profile
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn prepend-icon="mdi-logout" class="text-h6" @click="logout">
                    Logout
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu v-if="isLoggedIn && status === 'Admin'">
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props">
                  <v-avatar size="32" class="mr-2">
                    <v-img :src="profileImage" alt="Profile" />
                  </v-avatar>
                  {{ username }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn prepend-icon="mdi-account" @click="manageAdmin">
                    Manage Data
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn prepend-icon="mdi-logout" @click="logout">
                    Logout
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main style="--v-layout-top: 0px; --v-layout-bottom: 0px; padding-top: 0px;">
      <router-view />
    </v-main>

    <footer v-if="!$route.path.includes('profileUser') && !$route.path.includes('manage')" class="footer">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-img src="@/assets/logo1.png" alt="Logo" width="400" height="100" class="mr-4" />
            <p>Judspeccom is a website where you can design your own dream computer.</p>
          </v-col>
          <v-col cols="12" md="4" class="text-center sitemap-links">
            <h4>Sitemap</h4>
            <v-btn text to="/" block class="footer-btn" @click="scrollToTop">
              Home
            </v-btn>
            <v-btn text to="/toolV1" block class="footer-btn" @click="scrollToTop">
              Customize PC
            </v-btn>
            <v-btn text to="/LabCompare" block class="footer-btn" @click="scrollToTop">
              Compare
            </v-btn>
          </v-col>

          <v-col cols="12" md="4" class="text-right">
            <h4>Let's get Social!</h4>
            <v-btn icon href="https://facebook.com" target="_blank">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon href="https://mail.google.com/mail/u/0/#inbox" style="margin-left: 10px;" target="_blank">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, provide, watchEffect } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/AuthService"; //เรียก class AuthService
import apiProxy from "@/services/AuthProxy"; //เรียก class AuthProxy

// value
const router = useRouter();
const isLoggedIn = ref(false);
const username = ref("");
const email = ref("");
const profileImage = ref("");
const status = ref("")

onMounted(() => {
  loadUserFromServer();
});

// Function
const aaa = () => {
  TestProxy();
};

const TestProxy = async () => {
  const emailApi = await apiProxy.request(); // เรียกclass proxy
  if (emailApi.status) {
    //ถ้า true
    const emailProxy = emailApi.email; // ส่ง ชื่อ email
    console.log("PASS" + " " + emailProxy);
    return { status: true, email: emailProxy };
  } else {
    console.log("FAIL"); // ถ้า false
    return { status: false, email: undefined };
  }
};

provide('TestProxy', TestProxy);
const loadUserFromServer = async () => {
  try {
    const user = await authService.loadUserFromServer();
    if (user) {
      isLoggedIn.value = true;
      username.value = user.username;
      email.value = user.email;
      profileImage.value = user.profileImage || "";
      status.value = user.status
    }
    console.log("User Status:", status.value);
  } catch (error) {
    alert("Please Login again");
    logout();
  }

  const isRegisterOrLoginPage = computed(() => {
    return route.path === "/register" || route.path === "/login";
  });

};

onMounted(() => {
  setInterval(async () => {
    await loadUserFromServer();
  }, 10000); // ทุก 10 วินาที
});

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // ทำให้การเลื่อนขึ้นไปที่บนสุดทำได้อย่างนุ่มนวล
  });
}


const myProfile = () => {
  router.push("/profileUser");
};

const manageAdmin = () => {
  router.push("/manageAdmin");
};

const register = () => {
  router.push("/register");
};

const login = () => {
  router.push("/login");
};

const logout = async () => {
  const success = authService.logOut();
  if (success) {
    isLoggedIn.value = false;
    username.value = "";
    email.value = "";
    profileImage.value = "";
    status.value = "";
    router.push("/");
  }
};



// new Features
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
  provide('isDarkMode', isDarkMode);
};
</script>

<style scoped>
body,
.v-btn,
.v-col,
.content,
h1,
h2,
p {
  font-family: 'Kanit', sans-serif;
}

.v-btn,
.v-col {
  font-family: 'Kanit', sans-serif;
}


.footer {
  background-color: #333;
  color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer h4 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 10px;
}

.footer-btn {
  margin: 5px;
  padding: 0;
  font-size: 12px;
  color: white;
  background-color: transparent;
  border: none;
}

.footer .sitemap-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.footer .social-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.footer .text-center {
  font-size: 14px;
  text-align: center;
}

.footer p {
  margin: 0;
  font-size: 16px;
  text-align: center;
}

.footer .text-left,
.footer .text-right {
  font-size: 14px;
  text-align: center;
}

.footer .footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-main {
  background-color: #141414 !important;
  ;
}

.dark-mode {
  background-color: #141414 !important;
  color: rgb(255, 255, 255) !important;
}



.dark-mode .v-main {
  background-color: rgb(255, 255, 255) !important;
  color: rgb(0, 0, 0) !important;
}
</style>
