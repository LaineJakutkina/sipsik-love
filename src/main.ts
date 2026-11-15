import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./app/App.vue";
import { createAppRouter } from "./app/router";
import { i18n } from "./shared/locale";
import { useLocaleStore } from "./stores/locale";
import "./assets/main.css";

const pinia = createPinia();
await useLocaleStore(pinia).boot();

createApp(App).use(pinia).use(i18n).use(createAppRouter()).mount("#app");
