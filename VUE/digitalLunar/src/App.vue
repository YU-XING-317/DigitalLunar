<script setup>
import cesiumLunar from "./views/cesiumLunar.vue";
import { ref } from "vue";
import PlaceSearch from "./components/placeSearch.vue";
import PointSearch from "./components/pointSearch.vue";
import mitt from "./hook/mittBus";

const placeSearchRef = ref();
const placeSearch = () => {
  placeSearchRef.value.open();
};

const pointSearchRef = ref();
const pointSearch = () => {
  pointSearchRef.value.open();
};
</script>

<template>
  <div id="app">
    <el-container class="app-content-pannel">
      <el-aside class="menu">
        <el-menu>
          <el-menu-item index="1">
            <el-button type="primary" @click="placeSearch">地点搜索</el-button>
          </el-menu-item>
          <el-menu-item index="2">
            <el-button type="primary" @click="pointSearch">坐标搜索</el-button>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <cesiumLunar />
      </el-main>
    </el-container>
    <PlaceSearch ref="placeSearchRef"></PlaceSearch>
    <PointSearch ref="pointSearchRef"></PointSearch>
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
.app-content-pannel {
  background-color: black;
  height: 100%;
}
.menu {
  height: 100%;
  background-color: #606266;
  width: 120px !important;
  overflow: hidden;
}
.main {
  padding: 1px;
}
</style>
