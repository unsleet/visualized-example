import * as THREE from 'three'
const vertexShader = [
  //'varying vec3 vNormal;',
  'varying vec3   vVertexWorldPosition;',
  'varying vec3  vVertexNormal;',
  'void main() {',
  '  vVertexNormal  = normalize(normalMatrix * normal);',//将法线转换到视图坐标系中

  '  vVertexWorldPosition   = (modelMatrix * vec4(position, 1.0)).xyz;',//将顶点转换到世界坐标系中
  //'vNormal = normalize( normalMatrix * normal );',
  'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

  '}'

].join('\n')
const fragmentShader = [
  //'uniform float c;',
  //'uniform float p;',
  //'varying vec3 vNormal;',
  'varying vec3  vVertexNormal;',
  'varying vec3  vVertexWorldPosition;',
  'void main() {',

  //'float intensity = pow( 0.44 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 9.17 );',
  // vec3( 0.0, 0.0, 1.0 )该向量没有经过MVP变换 符合右手法则得向量
  //'float intensity = dot( vNormal, vec3( 0.0, 0.0, 1.0 ));',
  //'if(intensity > 0.55){ intensity = 0.0;}',
  '  vec3 worldVertexToCamera= vVertexWorldPosition - cameraPosition;', //世界坐标系中顶点位置到相机位置到的距离
  '  vec3 viewCameraToVertex    = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',//视图坐标系中
  '  viewCameraToVertex = normalize(viewCameraToVertex);',//规一化
  //'  float intensity       = 0.7 + dot(vVertexNormal, viewCameraToVertex);',
  //'  if(intensity > 0.55){ intensity = 0.0;}',
  ' float intensity       = pow(0.3 - dot(vVertexNormal, viewCameraToVertex), 4.1);',
  '  if(intensity > 1.0){ intensity = 0.0;}',
  'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 ) * intensity;',
  '}'

].join('\n')

export function createOuterGlow() {
  const glowGroup = new THREE.Group()
  glowGroup.name = 'glowGroup'

  glowGroup.add(createGlow())
  glowGroup.add(createBlack())

  const material = new THREE.LineBasicMaterial({color:0x0000ff})
  // 空几何体，里面没有点的信息,不想BoxGeometry已经有一系列点，组成方形了。
  const geometry = new THREE.Geometry()
  // 给空白几何体添加点信息，这里写3个点，geometry会把这些点自动组合成线，面。
  geometry.vertices.push(new THREE.Vector3(0,0,100))
  geometry.vertices.push(new THREE.Vector3(0,0,-100))
  geometry.vertices.push(new THREE.Vector3(0,100,100))
  //线构造
  const line=new THREE.Line(geometry, material)
  // 加入到场景中
  glowGroup.add(line)

  return glowGroup
}
function createBlack() {
  const sphere = new THREE.SphereGeometry(25, 40, 40)
  // const blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
  const blackMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, opacity: 0.5 } );

  const blackSphere = new THREE.Mesh(sphere, blackMaterial)
  blackSphere.position.z = 100
  blackSphere.scale.x = blackSphere.scale.y = blackSphere.scale.z = 1.5
  blackSphere.material.transparent = false
  blackSphere.name = 'blackSphere'

  return blackSphere
}
function createGlow() {
  const sphere = new THREE.SphereGeometry(25, 40, 40)
  const material = createFlowMaterial()

  const glowSphere = new THREE.Mesh(sphere, material)
 // glowSphere.material.side = THREE.BackSide
  glowSphere.material.transparent = false
  glowSphere.scale.x = glowSphere.scale.y = glowSphere.scale.z = 1.5
  glowSphere.name = 'glowSphere'

  return glowSphere
}
export function createFlowMaterial() {
  const material = new THREE.ShaderMaterial({
/*    uniforms: {
      'c': { type: 'f', value: 0.44 },
      'p': { type: 'f', value: 9.17 }
    },*/
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  return material
}
const AdditiveBlendShader = {

  uniforms: {

    'tSampler1': { type: 't', value: null },
    'tSampler2': { type: 't', value: null }
  },

  vertexShader: [

    'varying vec2 vUv;',

    'void main() {',

    'vUv = uv;',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: [

    'uniform sampler2D tSampler1;',
    'uniform sampler2D tSampler2;',

    'varying vec2 vUv;',

    'void main() {',

    'vec4 texture1 = texture2D( tSampler1, vUv );',
    'vec4 texture2 = texture2D( tSampler2, vUv );',
    'gl_FragColor = texture1 + texture2;',

    '}'

  ].join('\n')
}
export { AdditiveBlendShader }
