<script setup>
import * as Cesium from "cesium";
import { el, vi } from "element-plus/es/locale/index.mjs";
import { onMounted, reactive, watch, ref } from "vue";
// import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
// import mitt from "../hook/mittBus";
//import { Cesium.Measure } from "../js/cesium-measure";
import Location from "../assets/point.png";

onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZWFkZjUzYS0zMjNiLTRmNzItYmIzMC00NDNjNzk1MTc1OGEiLCJpZCI6MjAzODkzLCJpYXQiOjE3MTE5NTQ2NjB9.qBJHAwFo4OBYfX0r9U-kI8mmku67MO2nsHhmAcLEauU";
  let viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    baseLayerPicker: false,
    infoBox: false,
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    terrainExaggeration: 16,
  });
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.skyAtmosphere.show = false;
  //let measure = new Cesium.Measure(viewer);
  // 空间距离
  Cesium.TerrainProvider.heightmapTerrainQuality = 0.2;
  addWMSProvider(
    viewer,
    "http://localhost:8081/geoserver/digitalmoon/wms",
    "digitalmoon:moonDom"
  );
  addTerrainProvider(viewer, "http://localhost:8082/");
  //坐标跳转
  watch(point, (newValue, oldValue) => {
    console.log("point is changed", newValue, oldValue);
    setViewer(viewer, Number(newValue.x), Number(newValue.z));
    viewer.entities.removeAll();
    if (point.name == "point") {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          Number(newValue.x),
          Number(newValue.z),
          10
        ),
        billboard: {
          image: Location,
          scale: 0.04,
        },
      });
    } else {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          Number(newValue.x),
          Number(newValue.z),
          10
        ),
        label: {
          text: point.name,
          fillColor: Cesium.Color.RED,
          scale: 0.5,
        },
      });
    }
  });
  watch(viewSwitch, (newValue, oldValue) => {
    console.log("viewSwitch is changed", newValue, oldValue);
    if (newValue == true) {
      viewer.scene.morphTo3D(2);
    } else {
      viewer.scene.morphToColumbusView(2);
    }
  });
  viewer.scene.globe.terrainExaggeration = 256.0;
  viewer.scene.globe.terrainExaggerationRelativeHeight = 2400.0;
  console.log("onMounted");
});
//******************************************************************************* */
function init() {}

function addWMSProvider(viewer, url, layers, styles = "", where = "1=1") {
  const options = {
    url: url,
    layers: layers,
    parameters: {
      service: "WMS",
      version: "1.3.0",
      format: "image/png",
      transparent: true,
      styles: styles,
      cql_filter: where,
    },
  };
  const provider = new Cesium.WebMapServiceImageryProvider(options);
  viewer.imageryLayers.addImageryProvider(provider);
  console.log("图像加载");
  return viewer.imageryLayers.length;
}
// // 添加地形数据
const addTerrainProvider = async (viewer, url) => {
  try {
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(url);
    viewer.terrainProvider = terrainProvider;
    console.log("地形加载");
  } catch (error) {
    console.log(`${error}`);
  }
};

function setViewer(viewer, lng, lat) {
  const position = Cesium.Cartesian3.fromDegrees(lng, lat, 10000000);
  // const billBoard = new Cesium.Entity({
  //   position: position,
  //   billboard: {
  //     image: "../assets/point.png",
  //     scale: 1,
  //   },
  // });
  // viewer.entities.add(billBoard);
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 3,
  });
}

function test(viewer) {
  const position = Cesium.Cartesian3.fromDegrees(1, 1, 10000000);
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 3,
  });
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(Number(1), Number(1), 10),
    billboard: {
      image: Location,
      scale: 0.04,
    },
  });
}

//***********地点数据选择***********/
var point = reactive({
  name: "",
  x: undefined,
  z: undefined,
});

const points = reactive([
  {
    name: "知海",
    x: -22.3,
    z: -10.22,
  },
  { name: "湿海", x: -38.55, z: -23.5 },
  { name: "云海", x: -17.2, z: -20 },
  { name: "奢湖", x: 175.5, z: 19.5 },
  { name: "莫斯科海", x: 148, z: 28 },
  { name: "危海", x: 59, z: 17.24 },
  { name: "酒海", x: 34.58, z: -14.5 },
  { name: "静海", x: 30.8, z: 8.8 },
  { name: "澄海", x: 18.4, z: 28 },
  { name: "东海", x: -94.65, z: -19.05 },
]);
//********地点搜索**********
const Search = function () {
  for (var i = 0; i < 10; i++) {
    if (point.name == points[i].name) {
      point.x = points[i].x;
      point.z = points[i].z;
    }
  }
  console.log("Point为", point);
};
const pointSearch = function () {
  point.name = "point";
  console.log(point.x, point.z);
};
const reSetPoint = function () {
  point.x = "";
  point.z = "";
  point.name = "";
};
//***********陨石坑直径选择***********/
var diam = reactive({
  range: "",
  url: "",
});
var diams = reactive([
  {
    range: "2.5-3.5",
    url: "2.5-3.5",
  },
  {
    range: "3.5-5",
    url: "3.5-5",
  },
  {
    range: "5-7.1",
    url: "5-7.1",
  },
  {
    range: "7.1-10",
    url: "7.1-10",
  },
  {
    range: "10-14.1",
    url: "10-14.1",
  },
  {
    range: "14.1-20",
    url: "14.1-20",
  },
  {
    range: "28.3-40",
    url: "28.3-40",
  },
  {
    range: "40-56.6",
    url: "40-56.6",
  },
  {
    range: "56.6-80",
    url: "56.6-80",
  },
  {
    range: "80-131.1",
    url: "80-131.1",
  },
  {
    range: "131.1-160",
    url: "131.1-160",
  },
]);
var viewSwitch = ref(true);
</script>

<template>
  <div id="cesiumContainer">
    <!-- 顶部 -->
    <el-header class="tool-bar">
      <div class="tools">
        <!-- 三维二维切换 -->
        <el-switch
          v-model="viewSwitch"
          size="large"
          inline-prompt
          active-text="3D"
          inactive-text="2D"
          style="
            width: 60px;
            --el-switch-on-color: #66ccff;
            --el-switch-off-color: #39c5bb;
          "
        />
        <!-- 初始视图 -->
        <el-button type="primary" @click="test">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><House /></el-icon>
          </el-icon>
          <span style="vertical-align: middle">还原</span>
        </el-button>
        <el-button type="primary">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><ZoomIn /></el-icon>
          </el-icon>
          <span style="vertical-align: middle">放大 </span>
        </el-button>
        <el-button type="primary">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><ZoomOut /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 缩小 </span>
        </el-button>
        <el-button type="primary">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><Watermelon /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 测距 </span>
        </el-button>
        <el-button type="primary">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><Mug /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 面积 </span>
        </el-button>
        <el-button type="primary">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><Delete /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 清除 </span>
        </el-button>
      </div>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <el-aside class="search-bar">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '3']" unique-opened>
            <!-- 地点搜索 -->
            <el-sub-menu index="1">
              <template #title> <el-text tag="b">地点搜索</el-text> </template>
              <el-menu-item-group>
                <template #title
                  >地名
                  <!-- <el-button class="Search-reset" @click="reSetPoint"
                    >重置</el-button
                  > -->
                  <el-icon
                    @click="reSetPoint"
                    style="position: relative; left: 50% !important"
                    ><RefreshRight
                  /></el-icon>
                </template>
                <el-select
                  v-model="point.name"
                  filterable
                  class="Search"
                  @change="Search"
                >
                  <el-option
                    v-for="item in points"
                    :key="item"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-menu-item-group>
              <el-menu-item-group title="经度">
                <el-input
                  class="Search-x"
                  disabled="true"
                  :v-model="point.x"
                  :value="point.x"
                />
              </el-menu-item-group>
              <el-menu-item-group title="纬度">
                <el-input
                  class="Search-x"
                  disabled="true"
                  :v-model="point.z"
                  :value="point.z"
                />
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 坐标跳转 -->
            <el-sub-menu index="2">
              <template #title> <el-text tag="b">坐标跳转</el-text> </template>
              <el-menu-item-group title="经度">
                <input
                  v-model="point.x"
                  style="position: relative; left: 20%; width: 70%"
                  :value="point.x"
                />
              </el-menu-item-group>
              <el-menu-item-group title="纬度">
                <input
                  v-model="point.z"
                  style="position: relative; left: 20%; width: 70%"
                  :value="point.z"
                />
              </el-menu-item-group>
              <el-menu-item-group>
                <el-button class="Search-reset" @click="reSetPoint"
                  >重置</el-button
                >
                <el-button
                  class="Search-check"
                  type="primary"
                  @click="pointSearch"
                >
                  确认
                </el-button>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 显示切换 -->
            <el-sub-menu index="3">
              <template #title>
                <el-text tag="b">陨石坑显示</el-text>
              </template>
              <el-menu-item-group>
                <template #title>陨石坑直径选择</template>
                <el-select
                  v-model="diam.range"
                  clearable
                  filterable
                  class="Search"
                >
                  <el-option
                    v-for="item in diams"
                    :key="item"
                    :value="item.range"
                  ></el-option>
                </el-select>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-button class="Search-reset" @click="cleanProvider"
                  >重置</el-button
                >
                <el-button
                  class="Search-check"
                  type="primary"
                  @click="addProvider"
                >
                  确认
                </el-button>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
    </el-container>
    <el-foot class="info-bar">233</el-foot>
  </div>
</template>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
.canvas {
  height: 100% !important;
}
.cesium-widget-credits {
  display: none !important;
  visibility: hidden !important;
}
.cesium-viewer-fullscreenContainer {
  display: none !important;
  visibility: hidden !important;
}
.aside {
  width: 20%;
  left: 0;
}
.tool-bar {
  width: 100%;
  height: 6% !important;
  opacity: 0.5;
  background-color: white;
  position: absolute;
  z-index: 1;
}
.search-bar {
  height: 94%;
  top: 6%;
  opacity: 0.8;
  background-color: white;
  position: absolute;
  z-index: 1;
  width: 10% !important;
}
.info-bar {
  width: 100%;
  bottom: 0;
  height: 4% !important;
  opacity: 0;
  background-color: white;
  position: absolute;
  z-index: 1;
}
.Search {
  left: 20%;
  width: 75% !important;
  position: absolute;
}
.Search-x {
  left: 20%;
  width: 75% !important;
  position: absolute;
}
.Search-reset {
  left: 20% !important;
  position: relative;
}
.Search-check {
  left: 20% !important;
  position: relative;
}
.diam-Choice {
  left: 20%;
  position: relative;
  width: 70%;
}
.tools {
  position: relative;
  left: 60%;
  top: 20%;
  width: 39%;
}
</style>
