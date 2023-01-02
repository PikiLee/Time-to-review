import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/element.scss";
import "./assets/main.css";
import "@unocss/reset/antfu.css";
import "uno.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
