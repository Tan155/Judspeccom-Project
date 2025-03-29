<template>
  <v-app>
    <!-- NAVBAR -->
    <v-app-bar>
      <router-link to="/">
        Home
      </router-link>
      <v-spacer />
      <router-link to="/LabCompare">
        Lab
      </router-link>

      <!-- Menu REGISTER AND LOGIN -->

      <v-menu v-if="!isLoggedIn">
        <template #activator="{ props }">
          <v-btn color="primary" v-bind="props">
            Register
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <!-- Register -->
            <v-list-item-title>
              <v-btn prepend-icon="mdi-account" @click="register">
                Register
              </v-btn>
            </v-list-item-title>
          </v-list-item>
          <!-- Login -->
          <v-list-item>
            <v-list-item-title>
              <v-btn prepend-icon="mdi-login" @click="login">
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
            <v-btn prepend-icon="mdi-account" @click="myProfile">
              My Profile
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn prepend-icon="mdi-logout" @click="logout">
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
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
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
};

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
</script>
