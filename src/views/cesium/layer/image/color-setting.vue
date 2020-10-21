<template>
  <div class="adjustment-container">
    <div id="cesiumContainer" style="width: 100%;height: 100%;" />
    <div class="options-tool">
      <div class="block">
        <span class="demonstration">亮度</span>
        <el-slider v-model="brightness" :max="3" :step="0.02" />
      </div>
      <div class="block">
        <span class="demonstration">对比度</span>
        <el-slider v-model="contrast" :max="3" :step="0.02" />
      </div>
      <div class="block">
        <span class="demonstration">色调</span>
        <el-slider v-model="hue" :max="3" :step="0.02" />
      </div>
      <div class="block">
        <span class="demonstration">饱和度</span>
        <el-slider v-model="saturation" :max="3" :step="0.02" />
      </div>
      <div class="block">
        <span class="demonstration">伽马</span>
        <el-slider v-model="gamma" :max="3" :step="0.02" />
      </div>
    </div>
  </div>
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'ColorSetting',
  data() {
    return {
      brightness: 0,
      contrast: 0,
      hue: 0,
      saturation: 0,
      gamma: 0
    }
  },
  watch: {
    brightness(value) {
      this.layer['brightness'] = value
    },
    contrast(value) {
      this.layer['contrast'] = value
    },
    hue(value) {
      this.layer['hue'] = value
    },
    saturation(value) {
      this.layer['saturation'] = value
    },
    gamma(value) {
      this.layer['gamma'] = value
    }
  },
  mounted() {
    const imageLayer = new Cesium.TileMapServiceImageryProvider({
      url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    })
    const viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: imageLayer,
      baseLayerPicker: false,
      geocoder: false
    })
    this.layer = viewer.imageryLayers.get(0)
    this.brightness = this.layer['brightness']
    this.contrast = this.layer['contrast']
    this.hue = this.layer['hue']
    this.saturation = this.layer['saturation']
    this.gamma = this.layer['gamma']
  }
}
</script>
<style lang="scss">
  .options-tool{
    position: absolute;
    top: 50px;
    left: 100px;
    background-color: rgba(38, 38, 38, 0.75);
    padding: 20px 20px 10px 20px;
    color: #ffffff;
    border: 1px solid #526f82;
    width: 200px;
  }
</style>
