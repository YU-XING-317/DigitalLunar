<script setup>
import * as Cesium from "cesium";
import { onMounted, reactive, watch } from "vue";
import mitt from "../hook/mittBus";

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
    CreditsDisplay: false,
    terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl(
      "http://localhost:8082/"
    ),
  });
  addWMSProvider(
    viewer,
    "http://localhost:8081/geoserver/digitalmoon/wms",
    "digitalmoon:MoonDom"
  );

  mitt.on("data_x", (x) => {
    point.x = x;
  });
  mitt.on("data_z", (z) => {
    point.z = z;
  });
  watch(point, (newValue, oldValue) => {
    console.log("point is changed", newValue, oldValue);
    setViewer(viewer, Number(newValue.x), Number(newValue.z));
  });
  console.log(point);
});

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
    const terrainProvider = await Cesium.createWorldTerrainAsync({
      url: url,
    });
    viewer.terrainProvider = terrainProvider;
    console.log("地形加载");
  } catch (error) {
    console.log(`${error}`);
  }
};

function setViewer(viewer, lng, lat) {
  let a = (0, 0, 1000000);
  const position = Cesium.Cartesian3.fromDegrees(lng, lat, 10000000);
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

const point = reactive({
  name: "",
  x: null,
  z: null,
});
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
.canvas {
  height: 100%;
}
.cesium-widget-credits {
  display: none !important;
  visibility: hidden !important;
}
</style>
