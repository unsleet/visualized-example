import * as THREE from 'three'
export function initCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    5000
  )
  return camera
}
export function initRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    // 开启抗锯齿
    antialias: true,
    // 开启背景透明
    alpha: true
  })
  // 把自动清除颜色缓存关闭 这个如果不关闭 后期处理这块会不能有效显示
  // 书上的描述是 如果不这样做，每次调用效果组合器的render()函数时，之前渲染的场景会被清理掉。通过这种方法，我们只会在render循环开始时，把所有东西清理一遍。
  renderer.autoClear = false
  // 背景透明 配合 alpha
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 伽马值启动 更像人眼观察的场景
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  return renderer
}
