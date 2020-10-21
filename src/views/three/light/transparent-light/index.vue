<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
export default {
  name: 'Plant',
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init: function() {
      const container = document.getElementById('container')
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000)
      this.camera.position.z = 100
      this.camera.position.x = 100
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))

      this.scene = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.autoClear = true
      container.appendChild(this.renderer.domElement)

      this.scene.add(this.createObject())

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      // this.renderer.render(this.scene, this.camera)
    },
    createObject() {
      const vertexShader = [
        'varying vec3  vVertexWorldPosition;',
        'varying vec3  vVertexNormal;',
        'void main() {',
        '  vVertexNormal  = normalize(normalMatrix * normal);',
        '  vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n')
      const fragmentShader = [
        'uniform float bias;',
        'uniform float scale;',
        'uniform float power;',
        'varying vec3  vVertexNormal;',
        'varying vec3  vVertexWorldPosition;',
        'void main() {',
        '  vec3 worldVertexToCamera = vVertexWorldPosition - cameraPosition;',
        '  vec3 viewCameraToVertex = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',
        '  viewCameraToVertex = normalize(viewCameraToVertex);',
        '  float intensity = pow(bias + scale * abs(dot(vVertexNormal, viewCameraToVertex)), power);',
        '  gl_FragColor = vec4(0.2, 0.58, 0.9, intensity);',
        '}'

      ].join('\n')
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          'bias': { type: 'f', value: 1.0 },
          'scale': { type: 'f', value: -1.0 },
          'power': { type: 'f', value: 2.0 }
        },
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })

      const geometry = new THREE.TorusKnotGeometry(60, 10, 60, 8, 2, 5)

      this.object = new THREE.Mesh(geometry, material)
      return this.object
    }
  }
}
</script>
