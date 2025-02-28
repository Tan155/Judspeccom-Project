<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline text-center"
            >RESET PASSWORD</v-card-title
          >
          <v-card-text style="text-align: center">{{ email }}</v-card-text>

          <v-card-text>
            <v-form ref="form">
              <div>
                <h2>Password</h2>
                <v-text-field
                  label="Password"
                  v-model="password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="togglePassword"
                  required
                ></v-text-field>
              </div>

              <div>
                <h2>Confirm Password</h2>
                <v-text-field
                  label="Confirm Password"
                  v-mode="confirmPassword"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="confirmPasswordRules"
                  @click:append="togglePassword"
                  required
                ></v-text-field>
              </div>

              <v-btn block color="primary" @click="resetPassword"
                >Comfirm</v-btn
              >
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
import { useRoute, useRouter } from "vue-router";

//value
const route = useRoute();
const router = useRouter();
const email = ref(route.query.email);
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const form = ref(null);

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

const resetPassword = async () => {
  const isvalid = await form.value.validate();

  if (isvalid) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/resetPassword",
        {
          email: email.value,
          password: password.value,
        }
      );

      if (response.status == 200) {
        alert("Reset Password Success");
        router.push("/login");
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