import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

export function init (id) {
  const target = document.getElementById(id)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  const ratio = window.devicePixelRatio < 1.5 ? 1.5 : window.devicePixelRatio;
  renderer.setPixelRatio(ratio)
  renderer.setSize(target.clientWidth, target.clientHeight)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.sortObjects = true
  target.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(45, target.clientWidth / target.clientHeight,.1,200)
  camera.position.set(5, 20, 30)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(10526880)
  scene.fog = new THREE.Fog(10526880,5,150)

  // const axes = new THREE.AxesHelper(500)
  // scene.add(axes)

  const ambientLight = new THREE.AmbientLight(4473924)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(16777215)
  directionalLight.position.set(0, 20, 10)

  directionalLight.castShadow = true
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  scene.add(directionalLight)

  const material = new THREE.MeshPhongMaterial({
    color: 14596231,
    depthWrite: false
  })
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(400,400), material)
  mesh.rotation.x = -Math.PI / 2
  scene.add(mesh)

  const grid = new THREE.GridHelper(400, 50, 0, 0)
  grid.material.opacity = 0.2
  grid.material.transparent = true
  scene.add(grid)

  const controls = new TrackballControls(camera)
  controls.enableDamping = false
  controls.enableZoom = true
  controls.autoRotate = false
  controls.autoRotateSpeed = 3
  controls.minDistance = 10
  controls.maxDistance = 60
  controls.enablePan = false

  window.controls = controls
  window.camera = camera
  window.renderer = renderer
  window.scene = scene
  window.material = []

  animate()
}

export function animate () {
  for (let i = 0; i < window.material.length; i++) {
    const uniform = window.material[i].uniforms
    if (uniform.time) {
      window.material[i].uniforms.time.value = (((new Date()).getTime() - window.material[i]._time) % window.material[i].duration) / window.material[i].duration
    }
  }

  controls.update()
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
