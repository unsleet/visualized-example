<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TestImage',
  mounted() {
    const longitude = 106.915
    const latitude = 27.701
    const terrainUrl = 'http://39.104.20.117:31001/3DServer/terrain/fd1b7595ec764920a8e9c5e182ae9aad'
    const nightLayerUrl = 'http://39.104.20.117:31000/EzServer7/WMTS?SERVICE=WMTS&layer=zunyi_sldt&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tile&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}'
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns'
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      animation: false, // 是否显示动画控件(左下方那个控制地球自转时间)
      baseLayerPicker: false, // 是否显示图层选择控件
      timeline: false, // 是否显示时间线控件
      sceneModePicker: false, // 是否显示投影方式控件
      navigationHelpButton: false, // 是否显示帮助信息控件
      infoBox: false, // 是否显示点击要素之后显示的信息
      selectionIndicator: false, // 实体对象选择框
      homeButton: false,
      // sceneMode: Cesium.SceneMode.SCENE2D,
      fullscreenButton: false,
      shouldAnimate: true, // 进入页面是否开启动画
      geocoder: false // 查询位置输入框控件
    })
    window.viewer.resolutionScale = window.devicePixelRatio
    const nightLayer = new Cesium.WebMapTileServiceImageryProvider({
      layer: 'nightLayer',
      url: nightLayerUrl,
      style: 'default',
      tileMatrixSetID: 'default028mm',
      tilingScheme: new Cesium.GeographicTilingScheme(),
      tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
    })
    window.viewer.imageryLayers.removeAll()
    window.viewer.imageryLayers.addImageryProvider(nightLayer)
    window.viewer.scene.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 50000),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
      }
    })

    this.createEntity()
    const handler3D = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
    handler3D.setInputAction((click) => {
      const pick = new Cesium.Cartesian2(click.position.x, click.position.y)
      if (pick) {
        const pickFeature = window.viewer.scene.pick(pick)
        if (Cesium.defined(pickFeature)) {
          const feature = pickFeature.id
          const promise = window.viewer.flyTo(feature,  { duration: 1, offset : {
              heading: window.viewer.camera.heading,
              pitch: window.viewer.camera.pitch,
              range: window.viewer.camera.positionCartographic.height
            }})
          promise.then(() => {
            console.log('aaaaaaa')
          })
        }

      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    createEntity() {
      const options = {
        position: Cesium.Cartesian3.fromDegrees(106.915, 27.701, 10000),
        billboard: {
          image: 'assets/images/airport.png',
          width: 40,
          height: 40,
          //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          pixelOffset: new Cesium.Cartesian2(0, -20)
          //disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      }
      window.viewer.entities.add(options)
    }
  }
}
</script>
