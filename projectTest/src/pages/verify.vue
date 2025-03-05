<template>
  <v-container>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="400"
      width="100%"
    >
      <h3 class="text-h6 mb-4">Verify Your Account</h3>
      <div class="text-body-2">
        We sent a verification code to {{ authStore.getEmail }}
        <br />
        Please chceck your email and paste the code below.
      </div>

      <v-sheet color="surface">
        <v-otp-input v-model="otp" type="text"> </v-otp-input>
      </v-sheet>

      <v-btn
        class="my-4"
        color="purple"
        height="40"
        text="Verify"
        width="70%"
        @click="verifyOtp"
      >
      </v-btn>

      <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/AuthService";

// Value
const router = useRouter();
const otp = ref("");
const errorMessage = ref("");
const authStore = useAuthStore();
const email = ref("");
// Function
const verifyOtp = async () => {
  try {
    const response = await authService.verifyOtp(authStore.getEmail, otp.value);

    alert(response.message);
    if (response.redirectTo === "/login") {
      router.push(response.redirectTo);
    } else {
      email.value = authStore.email;
      authStore.setEmail(email);
      router.push(response.redirectTo);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style>
</style>