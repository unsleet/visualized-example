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
    },
    createEntity () {
      const vertexShader = [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
        '  gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n')
      const fragmentShader = [
        'uniform float time;',
        'uniform vec3 color;',
        'uniform float type;',
        'varying vec2 vUv;',
        'void main() {',
        '  float alpha = 1.0;',
        '  float dis = distance(vUv, vec2(0.5));',
        '  if(dis > 0.5){',
        '    discard;',
        '  }',
        '  float y = (sin(6.0 * 4.0 *(dis-time)) + 1.0)/2.0;',
        '  alpha = smoothstep(1.0, 0.0, abs(y-0.5)/0.5) * (0.5 -dis) * 2.;',
        '  gl_FragColor = vec4(color, alpha);',
        '}'
      ].join('\n')
      const geometry = new THREE.PlaneGeometry(5, 5, 1, 1)
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
      mesh.position.set(-3, 0, 0)
      mesh.renderOrder = 9

      window.scene.add(mesh)

      window.material.push(material)
    }
  }
}
</script>
