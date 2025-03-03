import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: "",
  }),
  actions: {
    setEmail(newEmail) {
      this.email = newEmail;
    },
  },
});
