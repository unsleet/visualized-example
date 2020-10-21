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
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
      this.camera.position.z = 0.6
      this.scene = new THREE.Scene()

      const reflectionCube = new THREE.CubeTextureLoader()
        .setPath('/assets/texture/SwedishRoyalCastle/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
      reflectionCube.encoding = THREE.sRGBEncoding
      this.scene.background = reflectionCube

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      this.controls.update()

      requestAnimationFrame(this.animate)
      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.02
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
