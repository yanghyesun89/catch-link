import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/naver",
    name: "NaverLoginCallback",
    component: () => import("@/views/NaverLoginCallback.vue"),
  },
  {
    path: "/google",
    name: "GoogleLoginCallback",
    component: () => import("@/views/GoogleLoginCallback.vue"),
  },
  {
    path: "/apple",
    name: "AppleLoginCallback",
    component: () => import("@/views/AppleLoginCallback.vue"),
  },
  {
    path: "/error",
    name: "ErrorCode500",
    component: () => import("@/views/Error500.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
