<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import { OBJLoader, MTLLoader } from 'three-object-mtl-loader'
import proj4 from 'proj4'
import json from './china.json'
// 创建一个时钟对象T
// const T = new THREE.Clock()
export default {
  name: 'GeoJSON',
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init() {
      this.container = document.getElementById('container')
      this.scene = new THREE.Scene()

      this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 10000)
      this.camera.position.y = -500
      this.camera.position.z = Math.min(this.container.clientWidth, this.container.clientHeight)

      this.controls = new TrackballControls(this.camera, this.container)
      this.controls.rotateSpeed = 1.0
      this.controls.zoomSpeed = 1.2
      this.controls.panSpeed = 0.8
      this.controls.noZoom = false
      this.controls.noPan = false
      this.controls.staticMoving = true
      this.controls.dynamicDampingFactor = 0.3
      this.controls.keys = [165, 83, 68]

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.container.appendChild(this.renderer.domElement)
      this.renderer.setClearAlpha(0)

      this.renderer.shadowMapSoft = true
      this.renderer.shadowCameraNear = 1
      this.renderer.shadowCameraFar = this.camera.far
      this.renderer.shadowCameraFov = 60
      this.renderer.shadowMapBias = 0.0025
      this.renderer.shadowMapDarkness = 0.5
      this.renderer.shadowMapWidth = this.container.clientWidth
      this.renderer.shadowMapHeight = this.container.clientHeight

      const light = new THREE.AmbientLight(0xffffff)
      this.scene.add(light)

      this.geoMap()
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    axisChange(lonlat) {
      const firstProjection = proj4('EPSG:4326')
      const secondProjection = proj4('EPSG:3857')
      return proj4(firstProjection, secondProjection, lonlat)
    },
    // 地理数据处理
    geoMap() {
      const data = []
      const allPointLon = []
      const allPointLat = []
      for (const i in json.features) {
        const obj = {
          name: json.features[i].properties.name,
          cp: this.axisChange(json.features[i].properties.cp),
          data: []
        }
        if (json.features[i].geometry.type === 'Polygon') {
          for (const j in json.features[i].geometry.coordinates) {
            const arr = []
            for (const k in json.features[i].geometry.coordinates[j]) {
              const point = this.axisChange(json.features[i].geometry.coordinates[j][k])
              arr.push(point)
              allPointLon.push(point[0])
              allPointLat.push(point[1])
            }
            obj.data.push(arr)
          }
        } else if (json.features[i].geometry.type === 'MultiPolygon') {
          for (const j in json.features[i].geometry.coordinates) {
            const arr = []
            for (const k in json.features[i].geometry.coordinates[j][0]) {
              const point = this.axisChange(json.features[i].geometry.coordinates[j][0][k])
              arr.push(point)
              allPointLon.push(point[0])
              allPointLat.push(point[1])
            }
            obj.data.push(arr)
          }
        }
        data.push(obj)
      }
      this.data = data
      // 获取中心点
      this.lonCenter = (Math.max.apply(Math.max, allPointLon) + Math.min.apply(Math.max, allPointLon)) / 2
      this.latCenter = (Math.max.apply(Math.max, allPointLat) + Math.min.apply(Math.max, allPointLat)) / 2
      this.addMesh(data, this.lonCenter, this.latCenter)
    },
    // 创建地图区块
    async addMesh(data, lonCenter, latCenter) {
      const loader = new THREE.FontLoader()
      // 字体自行更换 在线转换地址https://gero3.github.io/facetype.js/
      const font = await new Promise((resolve, reject) => {
        loader.load('/assets/fonts/font.json', (font) => {
          resolve(font)
        })
      })
      for (const i in data) {
        const group = new THREE.Group()
        this.scene.add(group)
        group.name = data[i].name
        for (const j in data[i].data) {
          const pointArr = []
          const extrudeSettings = {
            depth: 10,
            bevelEnabled: false
          }
          for (const k in data[i].data[j]) {
            const x = (data[i].data[j][k][0] - lonCenter) / 10000 // 经度
            const y = (data[i].data[j][k][1] - latCenter) / 10000 // 纬度
            pointArr.push(new THREE.Vector2(x, y))
          }
          const shape = new THREE.Shape(pointArr)
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
          geometry.computeBoundingSphere() // 计算中心
          const material = new THREE.MeshBasicMaterial({ color: 0x203A9A })
          const mesh = new THREE.Mesh(geometry, material)
          // 添加边缘线
          const edges = new THREE.EdgesGeometry(geometry)
          const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }))
          mesh.add(line)
          const fontGeometry = new THREE.TextGeometry(data[i].name, {
            font: font,
            size: 5,
            height: 1,
            bevelEnabled: false
          })
          const fontMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
          const fontMesh = new THREE.Mesh(fontGeometry, fontMaterial)
          // 省份标示位置可自行校准 1.json中cp中心点定位偏差  2.文字坐标自身偏差
          fontMesh.position.set((data[i].cp[0] - lonCenter) / 10000, (data[i].cp[1] - latCenter) / 10000, 10)
          group.add(fontMesh)
          group.add(mesh)
        }
      }
    },
    // 添加obj模型
    async addObj() {
      const textureResolve = file => {
        return '/assets/city/obj/' + file
      }
      const mtlLoader = new MTLLoader(THREE, textureResolve)
      const objLoader = new OBJLoader(THREE)
      const obj = await new Promise((resolve, reject) => {
        mtlLoader.load('/assets/obj/obj.mtl', (materials) => {
          materials.preload()
          objLoader.setMaterials(materials)
          objLoader.load('/assets/obj/obj.obj', (object) => {
            resolve(object)
          })
        })
      })
      obj.position.x = 0
      obj.position.y = 0
      obj.position.z = -120
      obj.scale.set(0.05, 0.05, 0.05)
      this.scene.add(obj)
    }
  }
}
</script>
