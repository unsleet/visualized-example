<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import { initCamera, initRenderer } from '../util/init'
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
      this.camera.position.z = 10
      this.camera.position.x = 10
      this.camera.position.y = 15

      this.camera.up.x = 0
      this.camera.up.y = 1 // 摄像机的上方向是Y轴
      this.camera.up.z = 0

      this.scene = new THREE.Scene()

      this.renderer = initRenderer(container)

      this.scene.add(this.createGroup())

      this.initLight()

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    initLight: function() {
      this.ambientLight = new THREE.AmbientLight(0xff0000)
      // this.scene.add(this.ambientLight)
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    createGroup() {
      const bgTexture = new THREE.TextureLoader().load(require('@/assets/texture/crystal.jpg'))
      this.group = new THREE.Group()
      for (let i = 0; i < 1; i++) {
        const material = new THREE.MeshBasicMaterial()
        material.map = bgTexture
        material.map.wrapS = THREE.RepeatWrapping
        material.map.wrapT = THREE.RepeatWrapping
        const geometry = this.createCrystalGeometry([0, 0], 1, 1.5, 12, 2, 0)
        geometry.scale(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5)

        geometry.rotateX(Math.PI / 2 * Math.random())
        geometry.rotateY(Math.PI * Math.random())
        geometry.rotateZ(Math.PI * Math.random())

        // 计算出颜色，使得geometry在光照下能看到多个面
        geometry.computeFaceNormals()

        this.group.add(new THREE.Mesh(geometry, material))
      }
      return this.group
    },
    /**
     *
     * @param coord 下面中心点
     * @param r1 下边圆的半径
     * @param r2 上边圆的半径
     * @param h1 下边高度
     * @param h2 上边高度
     * @param z 默认高度
     */
    createCrystalGeometry(coord, r1, r2, h1, h2, y) {
      const crystalGeometry = new THREE.Geometry()
      const edgeParameter = Math.sqrt(2) / 2
      // Three.js 右手法则 所有面的顺序必须一致： 大拇指朝向法线方向 顶点的顺序统一按照握拳手指朝向的方向
      const vertices = [
        new THREE.Vector3(coord[0] - edgeParameter * r1, y, coord[1] + edgeParameter * r1),
        new THREE.Vector3(coord[0] + edgeParameter * r1, y, coord[1] + edgeParameter * r1),
        new THREE.Vector3(coord[0] + edgeParameter * r1, y, coord[1] - edgeParameter * r1),
        new THREE.Vector3(coord[0] - edgeParameter * r1, y, coord[1] - edgeParameter * r1),
        new THREE.Vector3(coord[0] - edgeParameter * r2, y + h1, coord[1] + edgeParameter * r2),
        new THREE.Vector3(coord[0] + edgeParameter * r2, y + h1, coord[1] + edgeParameter * r2),
        new THREE.Vector3(coord[0] + edgeParameter * r2, y + h1, coord[1] - edgeParameter * r2),
        new THREE.Vector3(coord[0] - edgeParameter * r2, y + h1, coord[1] - edgeParameter * r2),
        new THREE.Vector3(coord[0], y + h1 + h2, coord[1])
      ]
      const faces = [
        new THREE.Face3(6, 5, 2),
        new THREE.Face3(5, 1, 2),

        new THREE.Face3(4, 7, 0),
        new THREE.Face3(7, 3, 0),

        new THREE.Face3(3, 2, 0),
        new THREE.Face3(2, 1, 0),

        new THREE.Face3(4, 0, 5),
        new THREE.Face3(0, 1, 5),

        new THREE.Face3(6, 2, 7),
        new THREE.Face3(2, 3, 7),

        new THREE.Face3(4, 5, 8),
        new THREE.Face3(5, 6, 8),
        new THREE.Face3(6, 7, 8),
        new THREE.Face3(7, 4, 8)
      ]

      const scaleX = 10
      const scaleY = 10

      const uvs = [
        [new THREE.Vector2(0, scaleY), new THREE.Vector2(0, 0), new THREE.Vector2(scaleX, scaleY)],
        [new THREE.Vector2(0, 0), new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY)],
        [new THREE.Vector2(0, 0), new THREE.Vector2(0, scaleY), new THREE.Vector2(scaleX, 0)],
        [new THREE.Vector2(0, scaleY), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(scaleX, 0)],
        [new THREE.Vector2(0, 0), new THREE.Vector2(0, scaleY), new THREE.Vector2(scaleX, 0)],
        [new THREE.Vector2(0, scaleY), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(scaleX, 0)],
        [new THREE.Vector2(0, 0), new THREE.Vector2(scaleX, 0), new THREE.Vector2(0, scaleY)],
        [new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, scaleY)],
        [new THREE.Vector2(0, scaleY), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, 0)],
        [new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(scaleX, 0), new THREE.Vector2(0, 0)],

        [new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, scaleY)],
        [new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, scaleY)],
        [new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, scaleY)],
        [new THREE.Vector2(scaleX, 0), new THREE.Vector2(scaleX, scaleY), new THREE.Vector2(0, scaleY)]
      ]

      crystalGeometry.faceVertexUvs[0] = uvs
      crystalGeometry.vertices = vertices
      crystalGeometry.faces = faces

      return crystalGeometry
    }
  }
}
</script>
