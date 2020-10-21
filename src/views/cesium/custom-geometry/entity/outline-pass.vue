<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
import GlowMaterialProperty from '../material/GlowMaterialProperty'
export default {
  name: 'FlowLine',
  mounted() {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    this.createEntity()
  },
  methods: {
    createEntity() {
      const lat = 30.598026044
      const lon = 114.302312702
      const material = new GlowMaterialProperty ({
        glowPower: 0.5,
        color: Cesium.Color.BLUE
      })
      const options = {
        name: 'yscNoNeedEntity',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            lon, lat, 0, //0 表示高度
            lon - 1, lat, 0,
            lon - 1, lat - 1, 0,
            lon - 2, lat - 1, 0,
            lon - 2, lat - 2, 0
          ]),
          width: 50,
          clampToGround: true,//贴地
          interval: 3000,
          material: material
        }
      }
      window.viewer.entities.add(options)
    }
  }
}
</script>
