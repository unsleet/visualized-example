<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TerrainImagery',
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
      // 雷达的高度
      const length = 400000.0
      // 地面位置(垂直地面)
      const positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9)
      // 中心位置
      const centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length * 0.5)
      // 顶部位置(卫星位置)
      const topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length)
      debugger
      // 矩阵计算
      const modelMatrix = Cesium.Matrix4.multiplyByTranslation( // 转换矩阵
        Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid), // 矩阵
        new Cesium.Cartesian3(0.0, 0.0, length * 0.5), // 要转换的笛卡尔坐标
        new Cesium.Matrix4() // 返回新的矩阵
      )
      // 1. 构造geometry
      const cylinderGeometry = new Cesium.CylinderGeometry({
        length: length,
        topRadius: 0.0,
        bottomRadius: length * 0.5,
        vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
      })
      // 2. 创建GeometryInstance
      const redCone = new Cesium.GeometryInstance({
        geometry: cylinderGeometry, // geomtry类型
        modelMatrix: modelMatrix // 模型矩阵 调整矩阵的位置和方向
      })

      const source =
         // 传入的动态数值
         `uniform vec4 color;
         uniform float repeat;
         uniform float offset;
         uniform float thickness;

        // 设置图形外观材质
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput); //获取内置的默认材质
          float sp = 1.0/repeat; //重复贴图
          vec2 st = materialInput.st; //二维纹理坐标
          float dis = distance(st, vec2(0.5)); //计算距离
          float m = mod(dis + offset, sp); //间隔
          float a = step(sp*(1.0-thickness), m);//线条拼色
          //修改材质
            material.diffuse = color.rgb;
            material.alpha = a * color.a;
          return material;
        }`
      const material = new Cesium.Material({
        fabric: {
          type: 'VtxfShader1',
          uniforms: { // 动态传递参数
            color: new Cesium.Color(0.2, 1.0, 0.0, 1.0),
            repeat: 30.0,
            offset: 0.0,
            thickness: 0.3
          },
          source: source
        },
        translucent: false
      })
      const appearance = new Cesium.MaterialAppearance({
        material: material, // 自定义的材质
        faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，					从而避免法向计算后发黑等问题
        closed: true // 是否为封闭体，实际上执行的是是否进行背面裁剪
      })
      // 添加Primitive
      const radar = window.viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: [redCone],
          appearance: appearance
        })
      )

      // 动态修改雷达材质中的offset变量，从而实现动态效果。
      window.viewer.scene.preUpdate.addEventListener(function() {
        let offset = radar.appearance.material.uniforms.offset
        offset -= 0.001
        if (offset > 1.0) {
          offset = 0.0
        }
        radar.appearance.material.uniforms.offset = offset
      })
    }
  }
}
</script>
