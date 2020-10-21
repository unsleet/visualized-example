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
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    console.log(viewer)
  }
}
</script>
