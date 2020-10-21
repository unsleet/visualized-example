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
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    createPlant() {
      const geometry = new THREE.PlaneGeometry(960, 480, 10, 10)
      // const geometry = new THREE.SphereBufferGeometry(50, 40, 40)
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
        'void main() {',
        '  float glow = 0.1 / abs(vUv.y - 0.5) - (0.1 / 0.5);',
        '  vec3 color;',
        '  if(glow>1.0){',
        '    color = vec3(0.0, 1.0, 0.0);',
        '  }else{',
        '    color = vec3(1.0, 0.0, 0.0);',
        '  }',
        '  gl_FragColor = vec4(color, glow);',
        '}'
      ].join('\n')
      const uniforms = {
      }
      //uniforms.texture1.value.magFilter = THREE.LinearFilter
      this.material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        transparent: true
      })
      this.plant = new THREE.Mesh(geometry, this.material)
      return this.plant
    }
  }
}
</script>
