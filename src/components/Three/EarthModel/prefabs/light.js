import * as THREE from 'three'
// 创建全局光源
export function createAmbient() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  ambientLight.name = 'ambient'

  return ambientLight
}
// 创建聚光灯
export function createSpot() {
  const spotLight = new THREE.SpotLight(0xffffff)

  spotLight.intensity = 1.2
  spotLight.position.x = -46
  spotLight.position.y = 35
  spotLight.position.z = -44
  spotLight.angle = 0.3
  spotLight.castShadow = false
  spotLight.penumbra = 0.4
  spotLight.distance = 124
  spotLight.decay = 1
  spotLight.shadow.camera.near = 50
  spotLight.shadow.camera.far = 200
  spotLight.shadow.camera.fov = 35
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.mapSize.width = 1024

  spotLight.name = 'spotLight'

  return spotLight
}
