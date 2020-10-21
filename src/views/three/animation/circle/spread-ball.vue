<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import { init } from '@/views/three/utils/three-base'
export default {
  name: 'CircleRing',
  data() {
    return {
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      init('container')
      this.createEntity()
      this.createBuilding()
    },
    createEntity () {
      const vertexShader = [
        'varying vec2 vUv;',
        'uniform float time;',
        'void main() {',
        '  vUv = uv;',
        '  float t = fract(time * 0.8) + 0.5;',
        '  vec3 finalpos = position * t;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalpos, 1.0);',
        '}'
      ].join('\n')
      const fragmentShader = [
        'uniform vec3 color;',
        'varying vec3 vNormal;',
        'varying vec3 pos;',
        'void main() {',
        '  float p = 0.8;',
        '  float nDotL = max(dot(normalize(lightDir - pos),vNormal),0.0);',
        '  float intensity = pow( nDotL , p );',
        '  float alpha = smoothstep(1.0,0.0,intensity);',
        '  gl_FragColor = vec4(color, alpha);',
        // '  if'
        '}'
      ].join('\n')
      const geometry = new THREE.SphereGeometry(5, 64, 64)
      const uniforms = {
        color: {
          type: 'color',
          value: new THREE.Color(49151)
        },
        time: {
          type: 'time',
          value: 0
        }
      }
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: true
      })
      material._time = (new Date()).getTime()
      material.duration = 6000

      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.x = Math.PI / 2
      mesh.position.set(0, 0, 0)
      mesh.renderOrder = 9

      window.scene.add(mesh)

      window.material.push(material)
    },
    createBuilding () {
      const material = new THREE.MeshLambertMaterial({
        color: 65280,
        transparent: true,
        opacity: 0.8
      })
      const geometries = new THREE.Geometry()
      for (let i = 0; i < 800; i++) {
        const geometry = new THREE.BoxGeometry(0.5,0.5,0.5)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.position.x = -50 + Math.round(100 * Math.random())
        mesh.position.y = 0.25
        mesh.position.z = -50 + Math.round(100 * Math.random())
        mesh.updateMatrix()
        geometries.merge(mesh.geometry, mesh.matrix)
      }
      window.scene.add(new THREE.Mesh(geometries, material))
    }
  }
}
</script>
