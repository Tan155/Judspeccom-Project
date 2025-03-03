<template>
  <v-container v-if="isVisit">
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-avatar size="40"
            ><v-img :src="profileImage" alt="profile"></v-img
          ></v-avatar>
        </v-list-item>

        <v-list-item-title style="position: absolute; left: 75px; top: 10px">
          {{ username }}
        </v-list-item-title>

        <v-list-item-subtitle style="position: absolute; left: 75px; top: 35px">
          {{ email }}
        </v-list-item-subtitle>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item.value"
          color="primary"
          @click="selectedItem = item.value"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- main -->

    <!-- My profile -->
    <v-card
      v-if="selectedItem == 'profile'"
      class="pa-6"
      style="
        height: 650px;
        margin-left: -275px;
        margin-right: -15px;
        margin-top: -80px;
        margin-bottom: -1000px;
        background-color: black;
      "
    >
      <v-card-text
        ><h1 style="position: absolute; left: 550px">
          Welcome {{ username }}
        </h1></v-card-text
      >

      <v-card-text>
        <div class="">
          <v-img
            :src="profileImage"
            width="250"
            height="250"
            class="profile-img"
            style="position: absolute; left: 510px; bottom: 300px"
          >
          </v-img>
        </div>

        <v-btn class="upload-btn" :loading="uploading"
          >Change PICTURE
          <input
            type="file"
            @change="uploadImage"
            class="file-input"
            accept="image/*"
        /></v-btn>
      </v-card-text>

      <v-card-text style="position: absolute; bottom: 100px; left: 400px">
        <h1>Username: {{ username }}</h1>
        <h1>Email: {{ email }}</h1>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else></v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AuthService } from "@/services/AuthService";

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
  { text: "My Files", icon: "mdi-folder", value: "files" },
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
const loadUserFromServer = async () => {
  try {
    const user = await AuthService.loadUserFromServer();
    if (user) {
      isVisit.value = true;
      username.value = user.username;
      email.value = user.email;
      profileImage.value = user.profileImage || "";
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
      const newProfileImage = await AuthService.uploadProfileImage(
        email.value,
        reader.result
      );
      profileImage.value = newProfileImage; // Update without reloading
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
.text-center {
  text-align: center;
}
.profile-img {
  border-radius: 50%;
  object-fit: cover;
}
.upload-btn {
  position: absolute;
  left: 550px;
  bottom: 250px;
  overflow: hidden;
}
.file-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.bk {
  background-color: aquamarine;
}
</style>
