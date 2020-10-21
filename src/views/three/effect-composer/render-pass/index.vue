<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import EffectComposer, {
  RenderPass
} from '@johh/three-effectcomposer'
export default {
  name: 'RenderPass',
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init: function() {
      this.$el = document.getElementById('container')
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.width, this.height)
      this.$el.appendChild(this.renderer.domElement)

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
      this.camera.position.z = 400

      this.scene = new THREE.Scene()
      // this.scene.fog = new THREE.Fog(0x000000, 1, 1000)

      this.object = new THREE.Object3D()
      this.scene.add(this.object)

      const geometry = new THREE.SphereBufferGeometry(1, 4, 4)
      for (var i = 0; i < 100; i++) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), flatShading: true })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
        mesh.position.multiplyScalar(Math.random() * 400)
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
        this.scene.add(mesh)
      }

      this.scene.add(new THREE.AmbientLight(0x222222))

      this.controls = new TrackballControls(this.camera)

      this.light = new THREE.DirectionalLight(0xffffff)
      this.light.position.set(1, 1, 1)

      this.scene.add(this.light)

      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      // this.glitchPass = new GlitchPass()
      // this.glitchPass.renderToScreen = true
      // this.composer.addPass(this.glitchPass)
    },
    animate: function() {
      this.controls.update()
      requestAnimationFrame(this.animate)
      this.object.rotation.x += 0.005
      this.object.rotation.y += 0.01
      this.composer.render()
    }
  }
}
</script>
