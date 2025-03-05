/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// ✅ ต้องกำหนด `app` ก่อนใช้งาน
const app = createApp(App);

// ✅ ติดตั้ง Pinia ให้ Vue ก่อน
app.use(createPinia());

// ✅ ลงทะเบียน Plugins (ต้องทำหลังจากกำหนด `app`)
registerPlugins(app);

// ✅ Mount แอป
app.mount("#app");
