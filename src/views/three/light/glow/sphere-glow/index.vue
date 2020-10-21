<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
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
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))

      this.scene = new THREE.Scene()

      this.scene.add(this.createEarth())
      this.scene.add(this.createInner())

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.autoClear = true
      container.appendChild(this.renderer.domElement)

      this.controls = new TrackballControls(this.camera)
      this.controls.rotateSpeed = 3
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    createEarth() {
      const sphere = new THREE.SphereGeometry(25, 40, 40)

      const bgTexture = new THREE.TextureLoader().load(require('@/assets/earth/earth4.jpg'))
      const material = new THREE.MeshBasicMaterial()
      material.map = bgTexture

      this.earth = new THREE.Mesh(sphere, material)
      return this.earth
    },
    createOuter() {
      const vertexShader = [
        'varying vec3   vVertexWorldPosition;',
        'varying vec3  vVertexNormal;',
        'void main() {',
        '  vVertexNormal  = normalize(normalMatrix * normal);', // 将法线转换到视图坐标系中
        '  vVertexWorldPosition   = (modelMatrix * vec4(position, 1.0)).xyz;', // 将顶点转换到世界坐标系中
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n')
      const fragmentShader = [
        'varying vec3  vVertexNormal;',
        'varying vec3  vVertexWorldPosition;',
        'void main() {',
        '  vec3 worldVertexToCamera = vVertexWorldPosition - cameraPosition;', // 世界坐标系中顶点位置到相机位置到的距离 指向被减
        '  vec3 viewCameraToVertex = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;', // 视图坐标系中
        '  viewCameraToVertex = normalize(viewCameraToVertex);', // 规一化
        '  float intensity = 0.9 + dot(vVertexNormal, viewCameraToVertex);', // 夹角逐渐变大 dot值之间变小
        '  gl_FragColor = vec4( 0.2, 0.58, 0.9, 1.0 ) * intensity;',
        '}'

      ].join('\n')
      const sphere = new THREE.SphereGeometry(25, 80, 80)
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      })
      const glowSphere = new THREE.Mesh(sphere, material)
      glowSphere.material.transparent = true
      glowSphere.scale.x = glowSphere.scale.y = glowSphere.scale.z = 1.05
      glowSphere.name = 'glowSphere'

      return glowSphere
    },
    createInner() {
      const vertexShader = [
        'varying vec3   vVertexWorldPosition;',
        'varying vec3  vVertexNormal;',
        'void main() {',
        '  vVertexNormal  = normalize(normalMatrix * normal);', // 将法线转换到视图坐标系中
        '  vVertexWorldPosition   = (modelMatrix * vec4(position, 1.0)).xyz;', // 将顶点转换到世界坐标系中
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n')
      const fragmentShader = [
        'varying vec3  vVertexNormal;',
        'varying vec3  vVertexWorldPosition;',
        'void main() {',
        '  vec3 worldVertexToCamera = vVertexWorldPosition - cameraPosition;', // 世界坐标系中顶点位置到相机位置到的距离 指向被减
        '  vec3 viewCameraToVertex = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;', // 视图坐标系中
        '  viewCameraToVertex = normalize(viewCameraToVertex);', // 规一化
        '  float intensity = pow(0.65 - dot(vVertexNormal, viewCameraToVertex), 4.0);', // 夹角逐渐变大 dot值之间变小
        '  if(intensity > 1.0){ intensity = 0.0;}',
        '  gl_FragColor = vec4( 0.2, 0.58, 0.9, 1.0 ) * intensity;',
        '}'

      ].join('\n')
      const sphere = new THREE.SphereGeometry(25, 80, 80)
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      })
      const glowSphere = new THREE.Mesh(sphere, material)
      glowSphere.material.transparent = true
      glowSphere.scale.x = glowSphere.scale.y = glowSphere.scale.z = 1.05
      glowSphere.name = 'glowSphere'

      return glowSphere
    }
  }
}
</script>
