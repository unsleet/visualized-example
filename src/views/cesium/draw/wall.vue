<template>
  <div>
    <div id="cesiumContainer" class="adjustment-container" />
    <el-button style="position:absolute;top:10px;left:10px;">啊啊啊</el-button>
  </div>
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'

const nightLayerUrl = 'http://39.104.20.117:31000/EzServer7/WMTS?SERVICE=WMTS&layer=zunyi_sldt&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tile&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}'


const longitude = 106.91523960722387
const latitude = 27.69601316437944
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns'

export default {
  name: 'DrawWall',
  mounted() {
    this.positions = []
    const that = this
    this.height = 200
    this.initViewer('cesiumContainer')
    /* window.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      baseLayerPicker: false,
      geocoder: false
    })*/
    /** window.viewer.entities.add({
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          106.91523960722387, 27.69601316437944,
          106.91903762631198, 27.69441996611857,
          106.9207880386703, 27.695088248897292
        ]),
        material: Cesium.Color.GREEN,
        minimumHeights: [865.9340922036448, 847.422070357176, 857.4955450569612],
        maximumHeights: [1000.0, 1000.0, 1000.0],
        outline: true
      }
    })*/
    this.initDraw()
  },
  methods: {
    showWall2Map () {
      const that = this
      const dynamicPositions = new Cesium.CallbackProperty(function () {
        const positions = []
        for (let i = 0; i < that.positions.length; i++) {
          const cartographic = Cesium.Cartographic.fromCartesian(that.positions[i])
          const longitude = Cesium.Math.toDegrees(cartographic.longitude) // 经度值
          const latitude = Cesium.Math.toDegrees(cartographic.latitude) // 纬度值
          positions.push(longitude)
          positions.push(latitude)
        }
        const _positions = Cesium.Cartesian3.fromDegreesArray(positions)
        return _positions
      }, false)
      const dynamicMinimumHeights = new Cesium.CallbackProperty(function () {
        const positions = []
        for (let i = 0; i < that.positions.length; i++) {
          const cartographic = Cesium.Cartographic.fromCartesian(that.positions[i])
          const height = cartographic.height // 高度值
          positions.push(height)
        }
        return positions
      }, false)
      const dynamicMaximumHeights = new Cesium.CallbackProperty(function () {
        const positions = []
        for (let i = 0; i < that.positions.length; i++) {
          const cartographic = Cesium.Cartographic.fromCartesian(that.positions[i])
          let height = cartographic.height // 高度值
          height += that.height
          positions.push(height)
        }
        return positions
      }, false)
      const options = {
        wall: {
          positions: dynamicPositions,
            material: new Cesium.GridMaterialProperty({
            color: Cesium.Color.GREY,
            cellAlpha: 0.3,
            lineCount: new Cesium.Cartesian3(8, 8),
            lineThickness: new Cesium.Cartesian3(2.0, 2.0)
          }),
          minimumHeights: dynamicMinimumHeights,
          maximumHeights: dynamicMaximumHeights,
          outline : true
        }
      }
      viewer.entities.add(options)
    },
    initViewer (id) {
      window.viewer = new Cesium.Viewer(id, {
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
      // 开启深度检测
      // window.viewer.scene.globe.depthTestAgainstTerrain = true
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
      window.viewer.scene.globe.baseColor = Cesium.Color.WHITE
      // 倾斜摄影 模型
      // addObliquePhotography(window.viewer.scene,config.Model.models.tilesets)
      // 地形
      var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: 'http://39.104.20.117:31001/3DServer/terrain/fd1b7595ec764920a8e9c5e182ae9aad'
      })
      viewer.scene.terrainProvider = terrainProvider;
    },
    initDraw () {
      const that = this
      const drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      drawHandler.setInputAction(function (event) {
        const position = event.position
        if (!Cesium.defined(position)) {
          return
        }
        const ray = viewer.camera.getPickRay(position)
        if (!Cesium.defined(ray)) {
          return
        }
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (!Cesium.defined(cartesian)) {
          return
        }
        const num = that.positions.length
        if (num === 0) {
          that.positions.push(cartesian)
          // floatingPoint = _this._createPoint(cartesian, -1)
          that.showWall2Map()
        }
        that.positions.push(cartesian)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      drawHandler.setInputAction(function (event) {
        const position = event.endPosition
        if (!Cesium.defined(position)) {
          return
        }
        if (that.positions.length < 1) {
          return
        }
        const ray = viewer.camera.getPickRay(position)
        if (!Cesium.defined(ray)) {
          return
        }
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (!Cesium.defined(cartesian)) {
          return
        }

        that.positions.pop()
        that.positions.push(cartesian)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      drawHandler.setInputAction(function (movement) {
        that.positions.pop()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
  }
}
</script>
