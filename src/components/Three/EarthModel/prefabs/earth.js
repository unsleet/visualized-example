import * as THREE from 'three'
const mapSize = {
  width: 2048,
  height: 1024
}
export default function createEarth() {
  const sphere = new THREE.SphereGeometry(25, 40, 40)
  const material = createEarthMaterial()

  const earth = new THREE.Mesh(sphere, material)
  // earth.material.side = THREE.BackSide
  earth.name = 'earth'

  return earth
}
// 创建地球材质
function createEarthMaterial() {
  const mapCanvas = document.createElement('canvas')
  const context = mapCanvas.getContext('2d')
  mapCanvas.width = mapSize.width
  mapCanvas.height = mapSize.height

  const planetTexture = new THREE.Texture(mapCanvas)

  new THREE.TextureLoader().load(require('@/assets/earth/earth4.jpg'), (texture) => {
    context.drawImage(texture.image, 0, 0)
    planetTexture.needsUpdate = true
  })

  const bumpTexture = new THREE.TextureLoader().load(require('@/assets/earth/earth_bump.jpg'))
  const specTexture = new THREE.TextureLoader().load(require('@/assets/earth/earth_spec.jpg'))

  const material = new THREE.MeshPhongMaterial()
  material.transparent = true
  material.map = planetTexture

  material.bumpMap = bumpTexture
  material.bumpScale = 0.15

  material.specularMap = specTexture
  material.specular = new THREE.Color('#909090')

  material.shininess = 5

  return material
}
