<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <p class="Title">Judpeccom</p>
        <v-card>
          <v-card-title class="headline text-center">Register</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <!-- User -->
              <div>
                <h2>User:</h2>
                <v-text-field label="User" v-model="username" :rules="nameRules" required></v-text-field>
              </div>

              <!-- Email -->
              <div>
                <h2>Email:</h2>
                <v-text-field label="Email" v-model="email" :rules="emailRules" required></v-text-field>
              </div>

              <!-- Password -->
              <div>
                <h2>Password:</h2>
                <v-text-field label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model="password" :rules="passwordRules" :type="showPassword ? 'text' : 'password'"
                  @click:append="togglePassword" required></v-text-field>
              </div>
              <!-- Confirm Password -->
              <div>
                <h2>Confirm Password:</h2>
                <v-text-field label="Confirm Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'" v-model="confirmpassword" :rules="confirmPasswordRules"
                  @click:append="togglePassword" required></v-text-field>
              </div>

              <v-btn block color="primary" @click="register">Register</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/AuthService";
import userFactory from "@/services/UserFactory";
import { useAuthStore } from "@/stores/authStore";
// Value
const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const showPassword = ref(false);
const valid = ref(false);
const form = ref(null);
const authStore = useAuthStore();
// Value Rules
const nameRules = [(v) => !!v || "Name is required",
(v) => /^[A-Za-z0-9_]+$/.test(v) || "Username must not contain special characters or spaces",];

const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 6 || "Password must be at least 6 characters long",
];

const confirmPasswordRules = computed(() => [
  (v) => !!v || "Confirm password is required",
  (v) => v === password.value || "Passwords do not match",
]);

// Function
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const register = async () => {
  const isvalid = await form.value.validate();
  if (isvalid) {
    try {
      const user = await userFactory.createUser({
        username: username.value,
        email: email.value,
        password: password.value,
      });

      const response = await authService.register(user);

      if (response) {
        alert("REGISTER SUCCESS PLEASE CHECK YOUR EMAIL");
        console.log("Register success please check your email");
        authStore.setEmail(email.value);
        router.push({ path: "/verify" });
      }
    } catch (error) {
      alert(error.message);
    }
  }
};
</script>

<style></style>