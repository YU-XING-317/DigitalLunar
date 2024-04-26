<script setup>
</script>

<template>
  <div id="app">
    <el-container class="app-content-pannel">
      <el-aside class="menu">
        <el-menu>
          <el-menu-item index="1">
            <span slot="title">地点查询</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">坐标搜索</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
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
