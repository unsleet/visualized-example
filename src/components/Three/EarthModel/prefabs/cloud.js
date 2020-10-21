import * as THREE from 'three'
export default function createCloud(radius, name) {
  const cloudSphere = new THREE.SphereGeometry(radius, 40, 40)
  const cloudMaterial = createClodMaterial()

  const cloudMesh = new THREE.Mesh(cloudSphere, cloudMaterial)
  cloudMesh.name = name

  return cloudMesh
}

function createClodMaterial() {
  const cloudTexture = new THREE.TextureLoader().load(require('@/assets/earth/earth_cloud.png'))

  const material = new THREE.MeshPhongMaterial()
  material.map = cloudTexture
  material.transparent = true
  material.opacity = 1
  material.blending = THREE.AdditiveBlending

  return material
}
