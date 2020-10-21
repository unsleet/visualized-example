<template>
  <div>
    <div id="cesiumContainer" class="adjustment-container" />
    <el-button @click="flyTo" style="position:absolute;top:10px;left:10px;">啊啊啊</el-button>
  </div>
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
import PolylineTrailLinkMaterialProperty from '../material/PolylineTrailLinkMaterialProperty'
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
    this.createEntity1()
  },
  methods: {
    createEntity() {
      const lat = 30.598026044;
      const lon = 114.302312702;
      const data2={
        flowing:true,
        flowImage:"./assets/images/colors1.png",//飞行线的图片
        options:{
          name: 'yscNoNeedEntity',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights( [
              lon, lat,0, //0 表示高度
              lon -1, lat, 0,
              lon -1, lat - 1, 0,
              lon - 2, lat-1, 0,
              lon - 2, lat -2, 0
            ]),
            width:5,
            clampToGround : true,//贴地
            material:Cesium.Color.YELLOW,
            interval: 3000
          }
        }
      }
      if(data2.flowing){
        data2.options.polyline.material = new PolylineTrailLinkMaterialProperty(data2.options.polyline.material,
          data2.options.polyline.interval, data2.flowImage);
      }
      this.entity = window.viewer.entities.add(data2.options)
    },
    createEntity1() {
      const lat = 25.598026044;
      const lon = 104.302312702;
      const data2={
        flowing:true,
        flowImage:"./assets/images/colors.png",//飞行线的图片
        options:{
          name: 'yscNoNeedEntity',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights( [
              lon, lat,0, //0 表示高度
              lon -1, lat, 0,
              lon -1, lat - 1, 0,
              lon - 2, lat-1, 0,
              lon - 2, lat -2, 0
            ]),
            width:5,
            clampToGround : true,//贴地
            material:Cesium.Color.YELLOW,
            interval: 3000
          }
        }
      }
      if(data2.flowing){
        data2.options.polyline.material = new PolylineTrailLinkMaterialProperty(data2.options.polyline.material,
          data2.options.polyline.interval, data2.flowImage);
      }
      window.viewer.entities.add(data2.options)
    },
    flyTo () {
      window.viewer.flyTo(this.entity, { offset : {
          heading : window.viewer.camera.heading,
          pitch : window.viewer.camera.pitch,
          range : window.viewer.camera.positionCartographic.height
        }})
    }
  }
}
</script>
