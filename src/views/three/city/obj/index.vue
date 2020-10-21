<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import { initCamera, initRenderer } from '../util/init'
import { OBJLoader, MTLLoader } from 'three-object-mtl-loader'
export default {
  name: 'Plant',
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init: function() {
      const container = document.getElementById('container')

      this.camera = initCamera()
      this.camera.position.z = 2
      this.camera.position.x = 0
      this.camera.position.y = 0
      this.camera.lookAt(0, -10, 0)

      this.scene = new THREE.Scene()

      this.renderer = initRenderer(container)

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material)

      // this.scene.add(this.mesh)
      this.loadObject()

      this.ambientLight = new THREE.AmbientLight(0x404040)
      this.scene.add(this.ambientLight)

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    loadObject() {
      const textureResolve = file => {
        return '/assets/city/obj/' + file
      }
      const mtlLoader = new MTLLoader(THREE, textureResolve)
      mtlLoader.load('/assets/city/obj/ny8.mtl', materials => {
        materials.preload()

        const objLoader = new OBJLoader(THREE)
        objLoader.setMaterials(materials)
        objLoader.load(
          '/assets/city/obj/ny8.obj',
          obj => {
            obj.position.x = 0
            obj.position.y = 0
            obj.position.z = 0

            obj.children.forEach(item => {
              item.geometry.center()
            })

            this.scene.add(obj)
          },
          xhr => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          }
        )
      })
    }
  }
}
</script>
