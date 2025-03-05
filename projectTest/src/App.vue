<template>
  <v-app>
    <!-- NAVBAR -->
    <v-app-bar>
      <router-link to="/">
        Home
      </router-link>
      <v-spacer />
      <router-link to="/DrawerTool">
        Drawer_Component
      </router-link>
      <v-spacer />
      <router-link to="toolV1">
        ToolV1
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
      <v-menu v-else>
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
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// value
const router = useRouter();
const isLoggedIn = ref(false);
const username = ref("");
const email = ref("");
const profileImage = ref("");

// Condition
if (
  localStorage.getItem("token") && // for check auth
  localStorage.getItem("username") &&
  localStorage.getItem("email") // for user || check auth
) {
  isLoggedIn.value = true;
  username.value = localStorage.getItem("username");
  email.value = localStorage.getItem("email");
  profileImage.value = localStorage.getItem("profileImage");
}

// Function

const myProfile = () => {
  router.push("/profileUser");
};

const register = () => {
  router.push("/register");
};

const login = () => {
  router.push("/login");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("profileImage");
  username.value = "";
  email.value = "";
  isLoggedIn.value = false;
  router.push("/");
};
</script>
