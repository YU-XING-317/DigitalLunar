<template>
  <div class="viewer">
    <vc-viewer @ready="ready" scene3-d-only>
      <vc-measure-distance
        :clamp-to-ground="clampToGround"
        ref="measureDistance"
        @activeEvt="activeEvt"
        @measureEvt="measureEvt"
        @movingEvt="movingEvt"
        :remove-last-position="removeLastPosition"
      ></vc-measure-distance>
      <vc-measure-area
        ref="measureArea"
        @activeEvt="activeEvt"
        @measureEvt="measureEvt"
        @movingEvt="movingEvt"
        :clamp-to-ground="clampToGround"
        :remove-last-position="removeLastPosition"
      ></vc-measure-area>
      <vc-measure-height
        ref="measureHeight"
        @activeEvt="activeEvt"
        @measureEvt="measureEvt"
        @movingEvt="movingEvt"
      ></vc-measure-height>
      <vc-primitive-tileset
        :url="modelUrl"
        @ready-promise="readyPromise"
      ></vc-primitive-tileset>
    </vc-viewer>
    <div class="demo-tool">
      <md-button
        class="md-raised md-accent"
        @click="toggle('measureDistance')"
        >{{ distanceMeasuring ? "停止" : "距离" }}</md-button
      >
      <md-button class="md-raised md-accent" @click="toggle('measureArea')">{{
        areaMeasuring ? "停止" : "面积"
      }}</md-button>
      <md-button class="md-raised md-accent" @click="toggle('measureHeight')">{{
        heightMeasuring ? "停止" : "高度"
      }}</md-button>
      <md-button class="md-raised md-accent" @click="clear">清除</md-button>
      <span>贴地</span>
      <el-switch v-model="clampToGround"></el-switch>
      <span style="color: blue">移除最后一个点</span>
      <md-switch v-model="removeLastPosition"></md-switch>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      modelUrl: "/static/3DTiles/Tilesets/Tileset/tileset.json",
      distanceMeasuring: false,
      areaMeasuring: false,
      heightMeasuring: false,
      clampToGround: false,
      removeLastPosition: true,
    };
  },
  methods: {
    ready(cesiumInstance) {
      const { Cesium, viewer } = cesiumInstance;
      var scene = viewer.scene;
      scene.debugShowFramesPerSecond = true;
      this.cesiumInstance = cesiumInstance;
      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    toggle(type) {
      this.$refs[type].measuring = !this.$refs[type].measuring;
    },
    clear() {
      this.$refs.measureDistance.clear();
      this.$refs.measureArea.clear();
      this.$refs.measureHeight.clear();
    },
    activeEvt(_) {
      this[_.type] = _.isActive;
    },
    measureEvt(result) {
      console.log(result);
    },
    movingEvt(position) {
      console.log(position);
    },
    readyPromise(tileset) {
      const { viewer } = this.cesiumInstance;
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
          0.0,
          -0.5,
          tileset.boundingSphere.radius * 2.0
        )
      );
    },
  },
};
</script>
  
  <style scoped>
.demo-tool {
  position: absolute;
  left: 1%;
  top: 1%;
  min-width: 185px;
  z-index: 100;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
.md-raised {
  background-color: #e91e63;
  color: rgba(255, 255, 255, 0.87);
}
.md-accent {
}
</style>
  
  