import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./app/App.vue";
import { createAppRouter } from "./app/router";
import "./assets/main.css";

createApp(App).use(createPinia()).use(createAppRouter()).mount("#app");
