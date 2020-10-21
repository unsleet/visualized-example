<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
import { defaultViewerSetting } from '@/cesium-ext/setting'
import { objectMerge } from '@/utils/index'
import cardPath from '@/assets/world/worldimage.jpg'
export default {
  name: 'TerrainImagery',
  mounted() {
    let setting = {
      imageryProvider: new Cesium.SingleTileImageryProvider({
        // url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        url: Cesium.buildModuleUrl(cardPath)
      }),
      baseLayerPicker: false,
      geocoder: false
    }
    setting = objectMerge(setting, defaultViewerSetting)
    const viewer = new Cesium.Viewer('cesiumContainer', setting)
    console.log(viewer)
  }
}
</script>
