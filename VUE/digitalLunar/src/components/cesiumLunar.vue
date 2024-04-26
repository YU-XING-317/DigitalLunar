<script setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    baseLayerPicker: false,
    infoBox: false,
    animation: false,
    timeline: false,
    geocoder: false,
    CreditsDisplay: false,
    //terrainProvider: Cesium.CesiumTerrainProvider.fromIonAssetId(1),
  });
  addWMSsvectorlayer(
    viewer,
    "http://localhost:8081/geoserver/digitalmoon/wms",
    "digitalmoon:MoonDom"
  );

  // addTerrainProvider(viewer, "http://localhost:8082/");
});

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZWFkZjUzYS0zMjNiLTRmNzItYmIzMC00NDNjNzk1MTc1OGEiLCJpZCI6MjAzODkzLCJpYXQiOjE3MTE5NTQ2NjB9.qBJHAwFo4OBYfX0r9U-kI8mmku67MO2nsHhmAcLEauU";

function addWMSsvectorlayer(viewer, url, layers, styles = "", where = "1=1") {
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

function addTerrainProvider(viewer, url) {
  const terrainProvider = new Cesium.CesiumTerrainProvider({
    url: url,
  });
  viewer.terrainProvider = terrainProvider;
  console.log("地形加载");
}
</script>

<template>
  <div id="cesiumContainer">
    
  </div>
</template>

<style >
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
