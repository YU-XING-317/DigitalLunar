<script setup>
import { reactive, ref, watch } from "vue";
import mitt from "../hook/mittBus";

const dialogVisible = ref(false);
const open = () => {
  dialogVisible.value = true;
};
defineExpose({
  open,
});

const Search = function () {
  dialogVisible.value = false;
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
</script>
<template>
  <el-dialog v-model="dialogVisible" title="坐标搜索" width="20%" center>
    <el-form :model="point">
      <el-form-item label="经度">
        <el-input v-model="point.x">{{ point.x }}</el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="point.z">{{ point.z }}</el-input>
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
  
