<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline text-center"
            >RESET PASSWORD</v-card-title
          >
          <v-card-text style="text-align: center">{{
            authStore.email
          }}</v-card-text>

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
                  v-model="confirmPassword"
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
            <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/AuthService";

//value
const route = useRoute();
const router = useRouter();
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const form = ref(null);
const errorMessage = ref("");
const authStore = useAuthStore();

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
      const response = await authService.resetPasswordUser(
        authStore.email,
        password.value
      );

      if (response.message) {
        alert(response.message);
        router.push(response.redirectTo);
      }
    } catch (error) {
      errorMessage.value = error.message;
    }
  }
};
</script>

<style>
</style>