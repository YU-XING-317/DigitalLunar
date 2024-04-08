<script setup>

</script>

<template>
<header>
  <div id="app">
    <el-container class="app-out-pannel">
      <el-header class="sys-header">DigitalLunar</el-header>
      <el-container class="app-content-pannel">
        <el-aside class="sys-menu">
          <el-menu>
            <el-menu-item index="1">
              <i class="el-icon-monitor"></i>
              <span slot="title">地图大屏</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-picture-outline"></i>
              <span slot="title">一张图</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class = 'sys-content'>
          
          <router-link to="{name : 'cesiumLunar'}"></router-link>   
        </el-main>
      </el-container>
    </el-container>
  </div>
  
</header>
</template>

<style scoped>
.app-out-pannel,
.app-content-pannel {
  height: 100%;
}
.sys-header {
  background-color: #303133;
  line-height: 60px;
  height: 60px;
  color: #fff;
  font-size: 600;
}
.sys-menu {
  background-color: #606266;
  width: 60px !important;
  overflow: hidden;
}
.sys-content {
  padding: 2px;
}
</style>