<script setup lang>
import * as Cesium from "cesium";
import { onMounted, reactive, watch, ref } from "vue";
import Location from "../assets/point.png";
import CesiumMeasures from "../js/cesium-measure-draw";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZWFkZjUzYS0zMjNiLTRmNzItYmIzMC00NDNjNzk1MTc1OGEiLCJpZCI6MjAzODkzLCJpYXQiOjE3MTE5NTQ2NjB9.qBJHAwFo4OBYfX0r9U-kI8mmku67MO2nsHhmAcLEauU";
let viewer = undefined;

onMounted(async () => {
  init();
});
//当前视角
var mouseMove = reactive({
  lnt: undefined,
  lat: undefined,
});
function getMouseMove() {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    //具体事件的实现
    var ellipsoid = viewer.scene.globe.ellipsoid;
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    var cartesian = viewer.camera.pickEllipsoid(
      movement.endPosition,
      ellipsoid
    );
    if (cartesian) {
      //将笛卡尔三维坐标转为地图坐标（弧度）
      var cartographic =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      //将地图坐标（弧度）转为十进制的度数
      mouseMove.lat = Cesium.Math.toDegrees(cartographic.latitude);
      mouseMove.lng = Cesium.Math.toDegrees(cartographic.longitude);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//初始化***************************************************************************** */
function init() {
  viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    baseLayerPicker: false,
    infoBox: false,
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
  });
  window.viewer = viewer;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.skyAtmosphere.show = false;
  addWMSProvider("digitalmoon:moonDom");
  addTerrainProvider("http://localhost:8082/");
  getMouseMove();
  // measure = new CesiumMeasures(window.viewer);
  // console.log("measure", measure);
}

// 地貌
function addWMSProvider(layers) {
  const options = {
    url: "http://localhost:8081/geoserver/digitalmoon/wms",
    layers: layers,
    parameters: {
      service: "WMS",
      version: "1.3.0",
      format: "image/png",
      transparent: true,
      styles: "",
      cql_filter: "1=1",
    },
  };
  const provider = new Cesium.WebMapServiceImageryProvider(options);
  viewer.imageryLayers.addImageryProvider(provider);
  console.log("图像加载");
  return viewer.imageryLayers.length;
}
// 添加地形数据
const addTerrainProvider = async (url) => {
  try {
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(url);
    viewer.terrainProvider = terrainProvider;
    console.log("地形加载");
  } catch (error) {
    console.log(`${error}`);
  }
};
//Tool-Bar***************************************************************************** */
//二维、三维切换
var viewSwitch = ref(true);
function twoThreeSwitch() {
  console.log("viewSwitch=", viewSwitch.value);
  if (viewSwitch.value == true) {
    viewer.scene.morphTo3D(2);
  } else if (viewSwitch.value == false) {
    viewer.scene.morphToColumbusView(2);
  }
}
// 还原
function homeButton() {
  viewSwitch.value = true;
  viewer.scene.morphTo3D(2);
  reSetPoint();
  reSetProvider();
  viewer.scene.camera.flyHome(2);
}
//放大缩小
function ZoomButton(t) {
  viewer = window.viewer;
  // var orientation = {
  //   heading: Cesium.Math.toRadians(viewer.camera.heading),
  //   pitch: Cesium.Math.toRadians(viewer.camera.pitch),
  //   roll: viewer.camera.roll,
  // };
  var position = viewer.camera.positionCartographic;
  console.log(position);
  position.z *= 0.5;
  var pos = Cesium.Cartesian3.fromDegrees(
    Cesium.Math.toDegrees(position.longitude),
    Cesium.Math.toDegrees(position.latitude),
    position.height * t
  );
  window.viewer.camera.flyTo({
    destination: pos,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 1,
  });
}
//***********量测***********/
//测距
function drawLine() {
  const measure = new CesiumMeasures(viewer);
  measure.drawLineMeasureGraphics({
    clampToGround: false,
    measure: true,
    style: {
      line: {
        width: 2,
        material: Cesium.Color.BLUE.withAlpha(0.8),
      },
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
        outlineColor: Cesium.Color.GREEN,
        outlineWidth: 3,
        show: true, //默认是显示点位
      },
    },
    callback: (e) => {
      console.log(e, "88888888888");
    },
  });
}
function area() {
  const measure = new CesiumMeasures(viewer);
  measure.drawAreaMeasureGraphics({
    clampToGround: false,
    measure: true,
    style: {
      line: {
        width: 2,
        material: Cesium.Color.RED.withAlpha(0.8),
        show: true, //默认为true
      },
      point: {
        pixelSize: 5,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 2,
        show: true, //默认为true
      },
      polygon: {
        material: Cesium.Color.GREEN.withAlpha(0.1),
      },
      //如果不设置centerPoint则会把测量的位置现在在最后一个点击的位置
      centerPoint: {
        pixelSize: 5,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 2,
      },
    },
    callback: (e) => {
      console.log(e, "88888888888");
    },
  });
}
function measureClean() {
  var dataSource = viewer.dataSources.getByName("measureLayer")[0];
  // 确保数据源存在

  if (Cesium.defined(dataSource)) {
    // 这里可以使用 dataSource 对象进行进一步的操作
    console.log("成功获取到数据源:", dataSource);
    viewer.dataSources.removeAll();
  } else {
    console.log("未找到名为 measureLayer 的数据源。");
  }
}
//侧边栏***************************************************************************** */
// 重置
const reSetPoint = function () {
  point.x = "";
  point.z = "";
  point.name = "";
  viewer.entities.removeAll();
};
// 地点搜索
function Search() {
  for (var i = 0; i < points.length; i++) {
    if (point.name == points[i].name) {
      point.x = points[i].x;
      point.z = points[i].z;
    }
  }
  console.log("Point为", point);
}
function placeSearch() {
  var viewer = window.viewer;
  const position = Cesium.Cartesian3.fromDegrees(
    point.x,
    point.z,
    viewer.camera.positionCartographic.height
  );
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 2,
  });
  viewer.entities.removeAll();
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      Number(point.x),
      Number(point.z),
      10
    ),
    label: {
      text: point.name,
      fillColor: Cesium.Color.RED,
      scale: 0.5,
    },
  });
}
//坐标跳转
function pointSearch() {
  var viewer = window.viewer;
  point.name = "point";
  console.log(point);
  const position = Cesium.Cartesian3.fromDegrees(
    point.x,
    point.z,
    viewer.camera.positionCartographic.height
  );
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 2,
  });
  viewer.entities.removeAll();
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      Number(point.x),
      Number(point.z),
      10
    ),
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

//***********陨石坑直径选择***********/
function addProvider() {
  console.log(diam);
  const options = {
    url: "http://localhost:8081/geoserver/digitalmoon/wms",
    layers: "digitalmoon:1",
    parameters: {
      service: "WMS",
      version: "1.3.0",
      format: "image/png",
      transparent: true,
      styles: "",
      cql_filter: "1=1",
    },
  };
  const provider = new Cesium.WebMapServiceImageryProvider(options);
  viewer.imageryLayers.addImageryProvider(provider);
  console.log("图像加载");
}
function reSetProvider() {
  diam.range = "";
  console.log(diam);
  const options = {
    url: "http://localhost:8081/geoserver/digitalmoon/wms",
    layers: "digitalmoon:moonDom",
    parameters: {
      service: "WMS",
      version: "1.3.0",
      format: "image/png",
      transparent: true,
      styles: "",
      cql_filter: "1=1",
    },
  };
  const provider = new Cesium.WebMapServiceImageryProvider(options);
  viewer.imageryLayers.addImageryProvider(provider);
}
var diam = reactive({
  range: "",
});
const diams = reactive([
  { range: "2.5-3.5" },
  { range: "3.5-5" },
  { range: "5-7.1" },
  { range: "7.1-10" },
  { range: "10-14.1" },
  { range: "14.1-20" },
  { range: "28.3-40" },
  { range: "40-56.6" },
  { range: "56.6-80" },
  { range: "80-131.1" },
  { range: "131.1-160" },
]);
function diamChange() {
  console.log(diam);
}
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
          @click="twoThreeSwitch"
        />
        <!-- 初始视图 -->
        <el-button type="primary" @click="homeButton">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><House /></el-icon>
          </el-icon>
          <span style="vertical-align: middle">初始</span>
        </el-button>
        <!-- 放大缩小 -->
        <el-button type="primary" @click="ZoomButton(0.5)">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><ZoomIn /></el-icon>
          </el-icon>
          <span style="vertical-align: middle">放大 </span>
        </el-button>
        <el-button type="primary" @click="ZoomButton(2)">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><ZoomOut /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 缩小 </span>
        </el-button>
        <!-- 量测 -->
        <el-button type="primary" @click="drawLine">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><Watermelon /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 测距 </span>
        </el-button>
        <el-button type="primary" @click="area">
          <el-icon style="vertical-align: middle">
            <el-icon size="20"><Mug /></el-icon>
          </el-icon>
          <span style="vertical-align: middle"> 面积 </span>
        </el-button>
        <el-button type="primary" @click="measureClean">
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
                  <!-- <el-icon @click="reSetPoint" style="position: relative; left: 50% !important"><RefreshRight/></el-icon> -->
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
                <el-input class="Search-x" disabled="true" :value="point.x" />
              </el-menu-item-group>
              <el-menu-item-group title="纬度">
                <el-input class="Search-x" disabled="true" :value="point.z" />
              </el-menu-item-group>
              <el-menu-item-group>
                <el-button class="Search-reset" @click="reSetPoint"
                  >重置</el-button
                >
                <el-button
                  class="Search-check"
                  type="primary"
                  @click="placeSearch"
                >
                  确认
                </el-button>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 坐标跳转 -->
            <el-sub-menu index="2">
              <template #title> <el-text tag="b">坐标跳转</el-text> </template>
              <el-menu-item-group title="经度">
                <el-input
                  type="number"
                  v-model.number="point.x"
                  class="Search-x"
                  :value="point.x"
                />
              </el-menu-item-group>
              <el-menu-item-group title="纬度">
                <el-input
                  type="number"
                  v-model.number="point.z"
                  class="Search-x"
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
                <el-select v-model="diam.range" filterable class="Search">
                  <el-option
                    v-for="item in diams"
                    :key="item"
                    :value="item.range"
                    @change="diamChange"
                  ></el-option>
                </el-select>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-button class="Search-reset" @click="reSetProvider"
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
    <el-foot class="info-bar">
      <div class="info">经度：{{ mouseMove.lng }}</div>
      <div class="info">纬度：{{ mouseMove.lat }}</div>
    </el-foot>
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
  height: 89%;
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
  height: 5% !important;
  opacity: 0.6;
  background-color: white;
  position: absolute;
  z-index: 1;
}
.info {
  width: 20%;
  left: 80%;
  position: relative;
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
