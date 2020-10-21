import * as THREE from 'three'
export default function createBackground() {
  const bgGeometry = new THREE.SphereGeometry(200, 50, 50)
  const material = createBackgroundMaterial()
  const bgMesh = new THREE.Mesh(bgGeometry, material)
  return bgMesh
}
function createBackgroundMaterial() {
  const bgTexture = new THREE.TextureLoader().load(require('@/assets/earth/bg_stars.jpg'))
  const material = new THREE.MeshBasicMaterial()

  material.map = bgTexture
  material.side = THREE.BackSide

  return material
}
