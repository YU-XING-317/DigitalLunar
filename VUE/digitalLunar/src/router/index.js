import { createRouter, createWebHistory } from "vue-router";
import cesiumLunar from "../views/cesiumLunar.vue";
import threeLunar from "../views/threeLunar.vue";

const routes = [
  {
    path: "/",
    name: "cesiumLunar",
    component: cesiumLunar,
  },
  {
    path: "/tL",
    name: "threeLunar",
    component: threeLunar,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
