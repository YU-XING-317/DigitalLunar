import { createApp } from "vue";
import App from "./App.vue";
//import './style.css'

import router from "./router";
// 整合ElementPlus
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";

//注册所有图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router).use(ElementPlus).mount("#app");
