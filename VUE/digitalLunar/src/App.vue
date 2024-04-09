<script setup>
import { Camera } from "@element-plus/icons-vue";
</script>

<template>
  <div id="app">
    <el-header class="header">数字月球</el-header>
      <el-container class="app-content-pannel">
        <!-- <el-aside class="menu">
          <el-menu>
            <el-menu-item index="1">
              <i prefix-icon="Camera"></i>
              <span slot="title">3D月球</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-picture-outline"></i>
              <span slot="title">Three</span>
            </el-menu-item>
          </el-menu>
        </el-aside> -->
        <el-main class="main">
          <router-view></router-view>
        </el-main>

    </el-container>
  </div>
  <!-- <div id="cesiumContainer"></div> -->
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
  height: 95%;
}
.header {
  background-color: #303133;
  line-height: 60px;
  height: 60px;
  color: #fff;
  font-size: 600;
}
.menu {
  height: 100%;
  background-color: #606266;
  width: 60px !important;
  overflow: hidden;
}
.main {
  padding: 1px;
}
</style>
