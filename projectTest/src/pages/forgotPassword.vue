<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline text-center"
            >Reset Password</v-card-title
          >

          <v-card-text class="text-center"
            >Please enter the email address that you used to register,<br />and
            we will send you a otp to reset your password via <br />
            Email.</v-card-text
          >

          <v-card-text>
            <v-form ref="form">
              <v-text-field
                label="Email"
                v-model="email"
                :rules="emailRules"
                required
              ></v-text-field>
              <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
              <v-btn block color="primary" @click="resetPassword"
                >Reset Password</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import authService from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";

// value
const email = ref("");
const router = useRouter();
const form = ref(null);
const errorMessage = ref("");
const authStore = useAuthStore();
const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

// Function
const resetPassword = async () => {
  const isValid = await form.value.validate();

  if (isValid) {
    try {
      const response = await authService.forgotPassword(email.value);
      if (response.message) {
        alert(response.message);
        authStore.setEmail(email.value);
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