<template>
  <v-container>
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

        <v-btn class="upload-btn"
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

    <v-card v-if="selectedItem == 'files'">
      <h1>Hello</h1>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// value
const selectedItem = ref("profile");
const profileImage = ref("");
const page = ref("0");

// Menu Navigation Drawer
const items = [
  { text: "My Profile", icon: "mdi-account", value: "profile" },
  { text: "My Files", icon: "mdi-folder", value: "files" },
];

const username = ref("");
const email = ref("");

onMounted(() => {
  if (localStorage.getItem("token") && localStorage.getItem("username")) {
    username.value = localStorage.getItem("username");
    email.value = localStorage.getItem("email");
    profileImage.value = localStorage.getItem("profileImage");
  }
});

// Function

// Upload Image
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email.value);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/user/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 200) {
      profileImage.value = response.data.profileImage;
      localStorage.setItem("profileImage", response.data.profileImage);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } catch (error) {
    console.log("Upload error", error);
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
