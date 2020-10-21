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
        url: 'https://t1.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8971e4c7b3640d506c2dc111221af6a0'
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    console.log(viewer)
  }
}
</script>
