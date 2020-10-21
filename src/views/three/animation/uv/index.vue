<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
// 创建一个时钟对象T
// const T = new THREE.Clock()
export default {
  name: 'UVAnimation',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      left: 0
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init: function() {
      this.duration = 9000
      this._time = (new Date()).getTime()

      const container = document.getElementById('container')
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000)
      this.camera.position.z = 100
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))

      this.scene = new THREE.Scene()

      this.scene.add(this.createPlant())

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.autoClear = true
      container.appendChild(this.renderer.domElement)

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      // 获得两次渲染的时间间隔deltaTime
      // const deltaTime = T.getDelta()
      // 更新uniforms中时间，这样就可以更新着色器中time变量的值
      this.material.uniforms.time.value = (((new Date()).getTime() - this._time) % this.duration) / this.duration

      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    createPlant() {
      // const geometry = new THREE.PlaneGeometry(960, 480, 10, 10)
      const geometry = new THREE.SphereBufferGeometry(50, 40, 40)
      const vertexShader = [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
        '  gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n')
      const fragmentShader = [
        'varying vec2 vUv;',
        'uniform sampler2D texture1;',
        'uniform float time;',
        'void main() {',
        '  vec2 newT = vec2(fract(vUv.x - time), vUv.y);',
        '  gl_FragColor = texture2D(texture1, newT);', // 通过偏移后的纹理坐标newT采样像素
        '  gl_FragColor.a = 1.0;', // 整体透明度增加
        '}'
      ].join('\n')
      const uniforms = {
        texture1: { value: new THREE.TextureLoader().load(require('@/assets/earth/earth4.jpg')) },
        time: { value: 0.0 }
      }
      uniforms.texture1.value.warpS = uniforms.texture1.value.warpT = THREE.RepeatWrapping
      //线性滤镜取原图中相邻像素并使用线性插值获得中间值来填充新点的颜色
      uniforms.texture1.value.minFilter = THREE.LinearFilter
      //uniforms.texture1.value.magFilter = THREE.LinearFilter
      this.material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: vertexShader
      })
      this.plant = new THREE.Mesh(geometry, this.material)
      return this.plant
    }
  }
}
</script>
