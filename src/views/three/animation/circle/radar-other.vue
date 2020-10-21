<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import * as THREE from 'three'
import { init } from '@/views/three/utils/three-base'
export default {
  name: 'RadarLine',
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
        'uniform float time;',
        'const float PI = 3.141592653589;',
        'void main() {',
        '  vUv = uv;',
        '  float a = -time * 2.0 * PI;',
        '  mat4 rMat= mat4(',
        '    cos(a), -sin(a), 0.0,0.0,',
        '    sin(a), cos(a), 0.0,0.0,',
        '    0.0, 0.0, 1.0,0.0,',
        '    0.0, 0.0, 0.0,1.0',
        '  );',
        '  vec4 mvPosition = modelViewMatrix * rMat * vec4(position, 1.0);',
        '  gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n')
      const fragmentShader = [
        'uniform float time;',
        'uniform vec3 color;',
        'varying vec2 vUv;',
        'const float PI = 3.141592653589;',
        'void main() {',
        '  vec2 center = vec2(0.5);',
        '  float dis = distance(vUv, center);',
        '  vec2 direct = normalize(vec2(vUv.x - center.x,vUv.y - center.y));', // 向量减法 指向被减得数  指向vUv
        '  float step = fract(0.0);',
        '  vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));',
        '  float radius1 = 0.49;',
        '  float radius2 = 0.03;',
        '  float alpha1 = smoothstep(1.0,0.0,abs(dis-radius1)/0.01);',
        //'  float alpha2 = smoothstep(1.0,0.0,abs(dis-radius2)/0.02);',
        '  float diff = -atan(direct.y,direct.x);',
        '  float alphastep;',
        '  if(diff > 0.0 && diff < PI/2.0){',
        '    alphastep = smoothstep(1.0,0.0,diff*2.0/PI);',
        '  }else{',
        '    alphastep = 0.0;',
        '  }',
        '  if(dis<radius1){',
        //'    gl_FragColor =  vec4(color,alphastep + (1.0 - alphastep) *alpha2 + alpha1);',
        '    gl_FragColor =  vec4(color,alphastep);',
        '  }else{',
        '    gl_FragColor =  vec4(color, alpha1);',
        '  }',
        '}'
      ].join('\n')
      const geometry = new THREE.PlaneGeometry(50, 50, 1, 1)
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
