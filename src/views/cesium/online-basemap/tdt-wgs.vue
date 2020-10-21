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
        // url: 'https://t5.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=8971e4c7b3640d506c2dc111221af6a0'
        url: 'https://t5.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=8971e4c7b3640d506c2dc111221af6a0',
        tilingScheme: new Cesium.GeographicTilingScheme({
          numberOfLevelZeroTilesX: 1,
          numberOfLevelZeroTilesY: 1,
          rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
        })
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    console.log(viewer)
  }
}
</script>
