import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: "", // ✅ เก็บ Email ของผู้ใช้
    userBuild: null, // ✅ เก็บข้อมูล User Build
  }),

  getters: {
    getEmail: (state) => state.email,
    getUserBuild: (state) => state.userBuild, // ✅ Getter สำหรับ User Build
  },

  actions: {
    setEmail(newEmail) {
      this.email = newEmail;
    },

    async fetchUserBuild() {
      try {
        if (!this.email) {
          console.error("❌ No email found in store.");
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/setcomputer/user-builds/${this.email}`
        );
        this.userBuild = response.data;
        console.log("✅ User Build loaded:", this.userBuild);
      } catch (error) {
        console.error(
          "❌ Error fetching user build:",
          error.response ? error.response.data : error.message
        );
      }
    },

    clearUserData() {
      this.email = "";
      this.userBuild = null;
    },
  },
});
