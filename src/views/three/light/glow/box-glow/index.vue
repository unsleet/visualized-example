<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import { RenderPass, EffectComposer, OutlinePass } from 'three-outlinepass'
export default {
  name: 'Plant',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },
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

      this.scene.add(this.createPlant())

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.autoClear = true
      container.appendChild(this.renderer.domElement)

      this.compose = new EffectComposer(this.renderer)
      const selectedObjects = [this.plant]
      const renderPass = new RenderPass(this.scene, this.camera)
      const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, selectedObjects)
      outlinePass.renderToScreen = true
      outlinePass.selectedObjects = selectedObjects
      this.compose.addPass(renderPass)
      this.compose.addPass(outlinePass)
      const params = {
        edgeStrength: 2,
        edgeGlow: 1,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        usePatternTexture: false
      }

      outlinePass.edgeStrength = params.edgeStrength
      outlinePass.edgeGlow = params.edgeGlow
      outlinePass.visibleEdgeColor.set(0xffffff)
      outlinePass.hiddenEdgeColor.set(0xffffff)

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.compose.render(this.scene, this.camera)
      // this.renderer.render(this.scene, this.camera)
    },
    createPlant() {
      const geometry = new THREE.BoxGeometry(40, 30, 10)
      const mesh = new THREE.MeshNormalMaterial()

      this.plant = new THREE.Mesh(geometry, mesh)
      return this.plant
    }
  }
}
</script>
