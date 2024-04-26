import { createRouter, createWebHistory } from "vue-router";
import cesiumLunar from "../views/cesiumLunar.vue";

const routes = [
  {
    path: "/",
    name: "cesiumLunar",
    component: cesiumLunar,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
