<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TerrainImagery',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    console.log(viewer)
  }
}
</script>
