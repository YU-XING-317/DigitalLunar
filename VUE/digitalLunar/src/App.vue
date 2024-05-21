<script setup>
import "element-plus/dist/index.css";
import cesiumLunar from "./views/cesiumLunar.vue";
import { ref } from "vue";

const handleClose = (key, keyPath) => {};
</script>

<template>
  <div id="app">
   
    <cesiumLunar />
  </div>
</template>
<style >
html,
body,
#app {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
}

.aside {
  background-color: black;
  height: 100%;
}
.menu {
  height: 100%;
  background-color: #606266;
  width: 130px !important;
  overflow: hidden;
}
.main {
  padding: 1px;
}
</style>
