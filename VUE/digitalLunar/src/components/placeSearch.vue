<script setup>
import { reactive, ref, computed } from "vue";
import mitt from "../hook/mittBus";

const dialogVisible = ref(false);
const open = () => {
  // point.name = "";
  // point.x = null;
  // point.z = null;
  console.log(point);
  dialogVisible.value = true;
};
defineExpose({
  open,
});

const Search = function () {
  dialogVisible.value = false;
  for (var i = 0; i < 2; i++) {
    console.log(points[i]);
    if (point.name == points[i].name) {
      point.x = points[i].x;
      point.z = points[i].z;
    }
  }
  console.log("Point为");
  console.log(point);
  mitt.emit("data_x", point.x);
  mitt.emit("data_z", point.z);
};

const point = reactive({
  name: "",
  x: null,
  z: null,
});

const points = reactive([
  {
    name: "知海",
    x: -22.3,
    z: -10.22,
  },
  { name: "湿海", x: -38.57, z: -24.0 },
]);
</script>

<template>
  <el-dialog v-model="dialogVisible" title="地点搜索" width="20%" center>
    <!-- @close="closeDialog" -->
    <el-form :model="point">
      <el-form-item label="地名">
        <el-select v-model="point.name">
          <el-option
            v-for="(item, index) in points"
            :key="index"
            :value="item.name"
          ></el-option>
        </el-select>
        <!--<el-input v-model="reviseForm.dtype"></el-input>-->
      </el-form-item>
      <el-form-item label="经度">
        <el-input disabled="true" :v-model="point.x" :value="point.x" />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input disabled="true" :v-model="point.z" :value="point.z" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="handleRevise(reviseData)"></el-button> -->
        <el-button type="primary" @click="Search"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
  
