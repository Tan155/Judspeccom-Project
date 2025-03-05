import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: "",
  }),
  getters: {
    getEmail: (state) => state.email,
  },
  actions: {
    setEmail(newEmail) {
      this.email = newEmail;
    },
  },
});
