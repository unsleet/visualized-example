import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import createBackground from '../prefabs/background'
import createEarth from '../prefabs/earth'
import createCloud from '../prefabs/cloud'
import { createOuterGlow, AdditiveBlendShader } from '../prefabs/outer-glow'
import { createAmbient, createSpot } from '../prefabs/light'
import EffectComposer, {
  RenderPass,
  ShaderPass
} from '@johh/three-effectcomposer'
class SceneView {
  constructor(el) {
    this.$el = el
    this.rotSpeed = 0.001

    this.isStart = false

    this.init()
  }
  init() {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight

    this.initCarema()
    this.initRender()
    this.initControls()
    this.initScene()
    this.initLight()

    this.animate()
  }
  initCarema() {
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
    this.camera.position.x = 0
    this.camera.position.z = -128
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }
  initScene() {
    this.scene = new THREE.Scene()

    const background = createBackground()
    this.scene.add(background)

    this.group = new THREE.Group()

    this.earth = createEarth()
    this.group.add(this.earth)
    this.cloud1 = createCloud(25.3, 'cloud1')
    this.cloud2 = createCloud(25.6, 'cloud2')
    this.cloud2.rotation.y = Math.PI
    this.group.add(this.cloud1)
    this.group.add(this.cloud2)

    this.scene.add(this.group)
    this.scene.add(this.camera)

    this.createOuterFlow()
  }
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    this.renderer.setSize(this.width, this.height)
    this.renderer.autoClear = true
    // this.renderer.setClearColor(0x000000, 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.$el.append(this.renderer.domElement)
  }
  initControls() {
    this.controls = new TrackballControls(this.camera)
    this.controls.rotateSpeed = 3
    // this.controls.autoRotate = false
    // this.controls.noZoom = true
    // this.controls.noPan = true
    // this.controls.enabled = true
  }
  initLight() {
    const ambient = createAmbient()
    this.scene.add(ambient)
    const spot = createSpot()
    this.scene.add(spot)
  }
  // 外发光
  createOuterFlow() {
    const renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: true
    }

    this.blurScene = new THREE.Scene()
    this.glowGroup = createOuterGlow()
    this.blurScene.add(this.glowGroup)

    const blurRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters)
    const blurRenderPass = new RenderPass(this.blurScene, this.camera)

    this.blurComposer = new EffectComposer(this.renderer, blurRenderTarget)
    this.blurComposer.addPass(blurRenderPass)

    const sceneRenderPass = new RenderPass(this.scene, this.camera)

    this.sceneComposer = new EffectComposer(this.renderer, blurRenderTarget)
    this.sceneComposer.addPass(sceneRenderPass)

    const effectBlend = new ShaderPass(AdditiveBlendShader, 'tSampler1')

    effectBlend.uniforms['tSampler2'].value = this.blurComposer.renderTarget2.texture

    effectBlend.renderToScreen = true

    this.sceneComposer.addPass(effectBlend)
  }
  animate() {
    if (this.controls) {
      this.controls.update()
    }
    this.cloud1.rotation.y -= 0.005
    this.cloud2.rotation.y -= 0.005

    //this.rotAutoHandler()

    this.render()
    requestAnimationFrame(() => {
      this.animate()
    })
  }
  render() {
    // this.renderer.render(this.scene, this.camera)
    if (this.isStart) {
      this.blurComposer.render()
      // this.sceneComposer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
      this.isStart = true
    }
  }
  rotAutoHandler() {
    this.camera.position.x = this.camera.position.x * Math.cos(this.rotSpeed) -
      this.camera.position.z * Math.sin(this.rotSpeed)

    this.camera.position.z = this.camera.position.z * Math.cos(this.rotSpeed) +
      this.camera.position.x * Math.sin(this.rotSpeed)
  }
}
export default SceneView
