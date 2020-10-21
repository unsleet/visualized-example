<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
const SameShock = {
  vertexShader: [
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'varying vec3 vVertexNormal;',
    'varying vec2 vUv;',
    'varying float v_pz;',
    'void main() {',
    '  vUv = uv;',
    '  v_pz = position.y; ',
    '  vVertexNormal = normalize(normal);',
    '  vColor = color;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform float boxH;',
    'varying vec3	vVertexNormal;',
    'varying vec3 vColor;',
    'varying vec2 vUv;',
    'varying float v_pz; ',
    'float plot (vec2 st, float pct){',
    '  return  smoothstep(pct-8.0, pct, v_pz) - smoothstep(pct, pct+0.02, v_pz);',
    '}',
    'void main(){',
    '  float f1 = plot(vUv, boxH);',
    '  vec4 b1 = mix(vec4(1.0,1.0,1.0,1.0),vec4(f1,f1,f1,1.0),0.8);',
    '  gl_FragColor = mix(vec4(vColor,1.0),b1,f1);',
    '  gl_FragColor = vec4(gl_FragColor.r,gl_FragColor.g,gl_FragColor.b,0.9);',
    '  if(vVertexNormal.y > 0.5){',
    '    gl_FragColor = vec4(vColor, 1.0);',
    '  }',
    '  gl_FragColor=vec4(vColor, 1.0);',
    '}'
  ].join('\n'),
  uniforms: {
    boxH: { value: -25.0 }
  }
}
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
export default {
  name: 'Plant',
  mounted() {
    this.init()
    this.animate()
  },
  methods: {
    init: function() {
      const container = document.getElementById('container')
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000)
      this.camera.position.z = 1
      this.scene = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)

      const group = new THREE.Group()
      for (let i = 0; i < 20; i++) {
        const h = Math.random() * 5
        const mesh = this.getMesh(h)
        mesh.translateX(i + 1)
        debugger
        group.add(mesh)
      }
      this.scene.add(group)
      this.controls = new TrackballControls(this.camera)
    },
    getMesh(h) {
      const cubeGeo = new THREE.BoxBufferGeometry(1, h, 1)
      cubeGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(24 * 3), 3))

      const colors1 = cubeGeo.attributes.color
      for (let i = 0; i < 24; i += 2) {
        const r = Math.random() * 0.8
        const g = Math.random() * 0.7
        const b = Math.random() * 0.5
        colors1.setXYZ(i, r, g, b)
        colors1.setXYZ(i + 1, r, g, b)
      }
      const k = 2
      colors1.setXYZ(k * 4 + 0, 0.0, 1.0, 1.0)
      colors1.setXYZ(k * 4 + 1, 0.0, 1.0, 1.0)
      colors1.setXYZ(k * 4 + 2, 0.0, 1.0, 1.0)
      colors1.setXYZ(k * 4 + 3, 0.0, 1.0, 1.0)
      this.material = new THREE.ShaderMaterial({
        vertexShader: SameShock.vertexShader,
        fragmentShader: SameShock.fragmentShader,
        uniforms: SameShock.uniforms
      })
      return new THREE.Mesh(cubeGeo, this.material)
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)

      this.material.uniforms.boxH.value += 1
    }
  }
}
</script>
