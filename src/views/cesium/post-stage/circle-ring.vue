<template>
  <div>
    <div id="cesiumContainer" class="adjustment-container" />
    <el-input v-model="lng" style="position: absolute;top:20px;left:20px;width:100px;" />
    <el-input v-model="lat" style="position: absolute;top:60px;left:20px;width:100px;" />
    <el-input v-model="height" style="position: absolute;top:100px;left:20px;width:100px;" />
    <el-button @click="getCoord()" type="primary" size="small" icon="el-icon-edit" style="position: absolute;top:140px;left:20px;">
      Edit
    </el-button>
  </div>
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TerrainImagery',
  data () {
    return {
      lng: 0,
      lat: 0,
      height: 0
    }
  },
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
    getCoord () {
      const ellipsoid = window.viewer.scene.globe.ellipsoid
      const cartographic = Cesium.Cartographic.fromDegrees(parseFloat(this.lng), parseFloat(this.lat), parseFloat(this.height))
      const cartesian = ellipsoid.cartographicToCartesian(cartographic)
      const aa = Cesium.Cartesian3.fromDegrees(parseFloat(this.lng), parseFloat(this.lat), parseFloat(this.height))
      console.log(cartesian)
      console.log(aa)
      /*const entity = window.viewer.entities.add({
        position: cartesian,
        billboard: {
          image: './assets/images/airport.png',
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })*/
      //window.viewer.flyTo(entity)
    },
    createEntity() {
      window.viewer.scene.globe.depthTestAgainstTerrain = true; // 防止移动、放大缩小会视觉偏移depthTestAgainstTerrain

      const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(106.915), Cesium.Math.toRadians(27.701), 0)
      const scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1)
      const maxRadius = 150000
      const duration = 4000
      const ScanSegmentShader =
        "uniform sampler2D colorTexture;" + // 颜色纹理
        "uniform sampler2D depthTexture;" + // 深度纹理
        "varying vec2 v_textureCoordinates;" + // 纹理坐标
        "uniform vec4 u_scanCenterEC;" + // 扫描中心
        "uniform vec3 u_scanPlaneNormalEC;" + // 扫描平面法向量
        "uniform float u_radius;" + // 扫描半径
        "uniform vec4 u_scanColor;" + // 扫描颜色
        "vec4 toEye(in vec2 uv, in float depth)" + // 根据二维向量和深度值 计算距离camera的向量
        " {" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);" + // 看看源码中关于此函数的解释是，cesium系统自动生成的4*4的反投影变换矩阵，从clip坐标转为眼睛坐标，clip坐标是指顶点着色器的坐标系统gl_position输出的
        " posInCamera =posInCamera / posInCamera.w;" + // 将视角坐标除深度分量
        " return posInCamera;" +
        " }" +
        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)" + // 点在平面上的投影，输入参数为 平面法向量，平面起始点，测试点
        "{" +
        "vec3 v01 = point -planeOrigin;" + // 计算测试点与平面起始点的向量
        "float d = dot(planeNormal, v01) ;" + // 平面法向量与 测试点与平面上的点 点积  点积的几何意义，b在a上的投影长度，即v01在平面法向量上的长度
        "return (point - planeNormal * d);" + // planeNormal * d 即为v01在平面法向量上的投影向量 根据三角形向量相加为0的原则 即可得点在平面上的投影
        "}" +
        "float getDepth(in vec4 depth)" + // 获取深度值，根据纹理坐标获取深度值
        "{" +
        "float z_window = czm_unpackDepth(depth);" + // 源码解释将一个vec4向量还原到0，1内的一个数
        "z_window = czm_reverseLogDepth(z_window);" + // czm_reverseLogDepth解开深度
        "float n_range = czm_depthRange.near;" +
        "float f_range = czm_depthRange.far;" +
        "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);" +
        "}" +
        "void main()" +
        "{" +
        "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);" + // 片元颜色
        "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));" + // 根据纹理获取深度值
        "vec4 viewPos = toEye(v_textureCoordinates, depth);" + // 根据纹理坐标和深度值获取视点坐标
        "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);" + // 点在平面上的投影，平面法向量，平面中心，视点坐标
        "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);" +  // 计算投影坐标到视点中心的距离
        "if(dis < u_radius)" + // 如果在扫描半径内，则重新赋值片元颜色
        "{" +
        //"float f = 1.0 -abs(u_radius - dis) / u_radius;" +  // 计算与扫描中心的距离并归一化
        //"f = pow(f, 4.0);" +
        //"gl_FragColor = mix(gl_FragColor, u_scanColor, f);" + // mix(x, y, a): x, y的线性混叠， x(1-a) + y*a 效果解释：在越接近扫描中心时，f越小，则片元的颜色越接近原来的，相反则越红
        '  float alpha = 1.0;'+
        '  float y = (sin(6.0 * 4.0 *(u_radius-dis)/u_radius) + 1.0)/2.0;'+
        '  alpha = smoothstep(1.0, 0.0, abs(y-0.5)/0.5) * (u_radius/2.0 -dis) / u_radius * 2.0;'+
        "  gl_FragColor = mix(gl_FragColor, u_scanColor, alpha);"+
        "}" +
        "}";

      const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
      const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
      const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500000);
      const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
      const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
      const _time = (new Date()).getTime();
      const _scratchCartesian4Center = new Cesium.Cartesian4();
      const _scratchCartesian4Center1 = new Cesium.Cartesian4();
      const _scratchCartesian3Normal = new Cesium.Cartesian3();
      const ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
          u_scanCenterEC: function () {
            const center = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            return center;
          },
          u_scanPlaneNormalEC: function () {
            const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
            _scratchCartesian3Normal.x = temp1.x - temp.x;
            _scratchCartesian3Normal.y = temp1.y - temp.y;
            _scratchCartesian3Normal.z = temp1.z - temp.z;
            Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
            return _scratchCartesian3Normal;

          },
          u_radius: function () {
            return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
          },
          u_scanColor: scanColor
        }
      });
      window.viewer.scene.postProcessStages.add(ScanPostStage)
    }
  }
}
</script>
