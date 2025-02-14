<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline text-center">Register</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <!-- User -->
              <div>
                <h2>User:</h2>
                <v-text-field
                  label="User"
                  v-model="username"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </div>

              <!-- Email -->
              <div>
                <h2>Email:</h2>
                <v-text-field
                  label="Email"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
              </div>

              <!-- Password -->
              <div>
                <h2>Password:</h2>
                <v-text-field
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model="password"
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="togglePassword"
                  required
                ></v-text-field>
              </div>
              <!-- Confirm Password -->
              <div>
                <h2>Confirm Password:</h2>
                <v-text-field
                  label="Confirm Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="confirmpassword"
                  :rules="confirmPasswordRules"
                  @click:append="togglePassword"
                  required
                ></v-text-field>
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
import axios from "axios";
import { useRouter } from "vue-router";

// Value
const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const showPassword = ref(false);
const valid = ref(false);
const form = ref(null);
// Value Rules
const nameRules = [(v) => !!v || "Name is required"];

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
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          username: username.value,
          email: email.value,
          password: password.value,
        }
      );

      if (response.status === 200) {
        alert("REGISTER SUCCESS PLEASE CHECK YOUR EMAIL");
        console.log("Register success please check your email");
        router.push({ path: "/verify", query: { email: email.value } });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred while registering");
      }
      console.log(error);
    }
  }
};
</script>

<style>
</style>