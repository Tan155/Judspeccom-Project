<template>
  <v-container v-if="isVisit">
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-avatar size="40">
            <v-img :src="profileImage" alt="profile" />
          </v-avatar>
        </v-list-item>

        <v-list-item-title style="position: absolute; left: 75px; top: 10px">
          {{ username }}
        </v-list-item-title>

        <v-list-item-subtitle style="position: absolute; left: 75px; top: 35px">
          {{ email }}
        </v-list-item-subtitle>
      </v-list>

      <v-divider />

      <v-list nav>
        <v-list-item v-for="(item, i) in items" :key="i" :value="item.value" color="primary"
          @click="selectedItem = item.value">
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          {{ item.text }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- main -->

    <!-- My profile -->
    <v-container v-if="selectedItem == 'profile'" fluid class="pa-5"
      style="min-height: 100vh; background-color: #121212; color: white; transform: translateX(-13%);">
      <v-row>
        <v-col cols="12">
          <h1 style="font-size: 48px;">
            My Profile
          </h1>
        </v-col>
      </v-row>
      <v-row class="fill-height" align="center" justify="center" no-gutters>
        <!-- Left: Text Section -->
        <v-col cols="12" md="6" class="d-flex flex-column justify-center pl-md-16 pr-md-10 px-6">
          <div>
            <h1 class="profile-name">
              {{ username }}
              <span class="underline-highlight" />
            </h1>
            <h2 class="profile-title mt-2">
              {{ email }}
            </h2>

            <v-btn class="email-verified d-flex align-center mt-6 cursor-grab">
              <v-icon size="28" color="green-lighten-2" class="mr-2">
                mdi-check-decagram
              </v-icon>
              <span class="verified-text">Email verified successfully</span>
            </v-btn>
          </div>
        </v-col>
        <!-- Right: Profile Image Box -->
        <v-col cols="12" md="6" class="d-flex flex-column align-center mt-6 mt-md-0">
          <div class="profile-box">
            <img :src="profileImage" class="profile-img">
          </div>

          <!-- ปุ่มอยู่ใต้รูป -->
          <div class="mt-4" style="cursor: grab;">
            <v-btn class="upload-btn text-none" color="#1A237E" :loading="uploading">
              Change Picture
              <input type="file" class="file-input" accept="image/*" @change="uploadImage">
            </v-btn>
          </div>
        </v-col>
        <v-row>
          <collectionBuildforUser />
        </v-row>
      </v-row>
    </v-container>



    <collectionBuildforUser v-else />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import authService from "@/services/AuthService";
import collectionBuildforUser from "@/components/collectionBuildforUser.vue";

// value
const selectedItem = ref("profile");
const profileImage = ref("");
const page = ref("0");
const isVisit = ref(false);
const router = useRouter();
const uploading = ref(false);

// Menu Navigation Drawer
const items = [
  { text: "My Profile", icon: "mdi-account", value: "profile" },
  // { text: "My Files", icon: "mdi-folder", value: "files" },
];

const username = ref("");
const email = ref("");

onMounted(async () => {
  await loadUserFromServer();
  if (isVisit.value == false) {
    router.push("/");
  }
});

// Function
const status = ref("")
const loadUserFromServer = async () => {
  try {
    const user = await authService.loadUserFromServer();
    if (user) {
      isVisit.value = true;
      username.value = user.username;
      email.value = user.email;
      profileImage.value = user.profileImage || "";
      status.value = user.status
    }
    if (status.value === 'Admin') {
      router.push('/')
    }
  } catch (error) {
    alert("Please Login again");
    isVisit.value = false;
    await logout();
  }
};

// Upload Image
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    try {
      uploading.value = true;
      const newProfileImage = await authService.uploadProfileImage(
        email.value,
        reader.result
      );
      profileImage.value = newProfileImage; // Update without reloading
      // setTimeout(() => {
      //   window.location.reload();
      // }, 100);
      loadUserFromServer();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      uploading.value = false;
    }
  };
};
const logout = async () => {
  const success = await AuthService.logOut();
  if (success) {
    isVisit.value = false;
    username.value = "";
    email.value = "";
    profileImage.value = "";
    router.push("/");
  }
};

// change page
</script>

<style>
/* .text-center {
  text-align: center;
}

.profile-img {
  border-radius: 50%;
  object-fit: cover;
}

.upload-btn {
  overflow: hidden;
}



.bk {
  background-color: aquamarine;
} */

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* New */
.profile-name {
  font-size: 54px;
  font-weight: 900;
  position: relative;
  display: inline-block;
  line-height: 1.2;
  color: white;
}

.underline-highlight {
  position: absolute;
  width: 300px;
  height: 10px;
  background-color: #00c58e;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.profile-title {
  font-size: 26px;
  font-weight: 400;
  color: #cccccc;
}

.email-verified {
  background-color: #1e1e1e;
  padding: 10px 18px;
  border-radius: 10px;
  width: fit-content;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.verified-text {
  font-size: 16px;
  color: #d0f0c0;
  font-weight: 500;
}

.profile-box {
  background-color: #263238;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-img {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}
</style>
