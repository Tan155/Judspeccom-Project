<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <p class="Title">Judspeccom</p>
        <v-card>
          <v-card-title class="headline text-center">Login</v-card-title>

          <v-card-text>
            <v-form ref="form">
              <!-- Username -->
              <div>
                <h2>Username:</h2>
                <v-text-field label="username" v-model="username" :rules="nameRules" required></v-text-field>
              </div>

              <div>
                <h2>Password:</h2>
                <v-text-field label="password" v-model="password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'" @click:append="togglePassword" required></v-text-field>
                <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
              </div>
              <v-btn block color="primary" @click="login">Login</v-btn>
              <br />
              <v-card-subtitle class="text-right">
                <router-link to="/forgotPassword">Forgot Password?</router-link>
              </v-card-subtitle>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/AuthService";

// variable
const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const showPassword = ref(false);

const nameRules = [(v) => !!v || "Name is required",
(v) => /^[A-Za-z0-9_]+$/.test(v) || "Username must not contain special characters or spaces",];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 6 || "Password must be at least 6 characters long",
];

// Function

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    const response = await authService.logIn(username.value, password.value);

    if (response.redirectTo) {
      alert(response.message);
      router.push(response.redirectTo);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style>

.Title{
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 25px 0 25px 0;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: transparent;
  position: relative;
  -webkit-text-stroke: 3px darkmagenta;
  font-size: 25px;
  cursor: pointer;
  font-size: 50px;
}

</style>