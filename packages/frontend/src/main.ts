import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";

import "uno.css";
import "@unocss/reset/antfu.css";
import "./assets/element.scss";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(i18n).use(pinia);

app.mount("#app");
