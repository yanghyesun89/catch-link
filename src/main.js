import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import Vue3Lottie from "vue3-lottie";

createApp(App).use(i18n).use(Vue3Lottie).use(store).use(router).mount("#app");
