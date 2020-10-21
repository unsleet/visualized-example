import Layout from '@/layout'

const cesiumRouter = {
  path: '/cesium',
  component: Layout,
  redirect: '/cesium/layer/terrain',
  name: 'Cesium',
  meta: {
    title: 'cesium示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'layer',
      component: () => import('@/views/cesium/index'), // Parent router-view
      name: 'layer',
      meta: { title: '图层示例' },
      redirect: '/cesium/layer/terrain',
      children: [
        {
          path: 'terrain',
          component: () => import('@/views/cesium/layer/terrain/index'),
          name: 'terrain-imagery',
          meta: { title: '地形影像' }
        },
        {
          path: 'image',
          component: () => import('@/views/cesium/layer/image/index'),
          name: 'image',
          meta: { title: '影像' },
          children: [
            {
              path: 'dynamic-time',
              component: () => import('@/views/cesium/layer/image/dynamic-time'),
              name: 'terrain-imagery',
              meta: { title: '动态时效' }
            },
            {
              path: 'adjustment',
              component: () => import('@/views/cesium/layer/image/color-setting'),
              name: 'color-setting',
              meta: { title: '颜色设置' }
            }
          ]
        }
      ]
    },
    {
      path: 'online-basemap',
      component: () => import('@/views/cesium/index'), // Parent router-view
      name: 'layer',
      meta: { title: '图层示例' },
      redirect: '/cesium/online-basemap/local-image',
      children: [
        {
          path: 'local-image',
          component: () => import('@/views/cesium/online-basemap/local-image'),
          name: 'local-image',
          meta: { title: '本地图片' }
        },
        {
          path: 'arcgis-map',
          component: () => import('@/views/cesium/online-basemap/arcgis-map'),
          name: 'arcgis-map',
          meta: { title: 'ARCGIS' }
        },
        {
          path: 'google-map',
          component: () => import('@/views/cesium/online-basemap/google-map'),
          name: 'google-map',
          meta: { title: '谷歌地图' }
        },
        {
          path: 'tdt-mercator',
          component: () => import('@/views/cesium/online-basemap/tdt-mercator'),
          name: 'google-map',
          meta: { title: '天地图墨卡托' }
        },
        {
          path: 'tdt-wgs',
          component: () => import('@/views/cesium/online-basemap/tdt-wgs'),
          name: 'google-map',
          meta: { title: '天地图经纬度' }
        }
      ]
    },
    {
      path: 'custom-geometry',
      component: () => import('@/views/cesium/index'), // Parent router-view
      name: 'layer',
      meta: { title: '图元' },
      redirect: '/cesium/custom-geometry/shaders/shaders-simple',
      children: [
        {
          path: 'entity',
          component: () => import('@/views/cesium/custom-geometry/entity/index'),
          name: 'entity',
          meta: { title: 'Entity' },
          children: [
            {
              path: 'flow-line',
              component: () => import('@/views/cesium/custom-geometry/entity/flow-line'),
              name: 'flow-line',
              meta: { title: '流动线' }
            },
            {
              path: 'outline-pass',
              component: () => import('@/views/cesium/custom-geometry/entity/outline-pass'),
              name: 'outline-pass',
              meta: { title: 'OutlinePass' }
            },
            {
              path: 'test-image',
              component: () => import('@/views/cesium/custom-geometry/entity/test-image'),
              name: 'test-image',
              meta: { title: '测试' }
            },
            {
              path: 'shock-wave',
              component: () => import('@/views/cesium/custom-geometry/entity/shock-wave'),
              name: 'shock-wave',
              meta: { title: '圆形扩散' }
            }
          ]
        },
        {
          path: 'shaders',
          component: () => import('@/views/cesium/custom-geometry/shaders/index'),
          name: 'shaders',
          meta: { title: '着色器' },
          children: [
            {
              path: 'shaders-simple',
              component: () => import('@/views/cesium/custom-geometry/shaders/simple'),
              name: 'shaders-simple',
              meta: { title: '简单示例' }
            }
          ]
        },
        {
          path: 'geometry-instance',
          component: () => import('@/views/cesium/custom-geometry/geometry-instance/index'),
          name: 'GeometryInstance',
          meta: { title: 'GeometryInstance' },
          children: [
            {
              path: 'geometry-instance-simple',
              component: () => import('@/views/cesium/custom-geometry/geometry-instance/simple'),
              name: 'geometry-instance-simple',
              meta: { title: '简单示例' }
            }
          ]
        }
      ]
    },
    {
      path: 'poststage',
      component: () => import('@/views/cesium/index'), // Parent router-view
      name: 'poststage',
      meta: { title: '后期效果' },
      redirect: '/cesium/poststage/circle-ripple',
      children: [
        {
          path: 'circle-ripple',
          component: () => import('@/views/cesium/post-stage/circle-ripple'),
          name: 'circle-ripple',
          meta: { title: '圆形扩散' }
        },
        {
          path: 'circle-ring',
          component: () => import('@/views/cesium/post-stage/circle-ring'),
          name: 'circle-ring',
          meta: { title: '圆环扩散' }
        },
        {
          path: 'circle-scan',
          component: () => import('@/views/cesium/post-stage/circle-scan'),
          name: 'circle-scan',
          meta: { title: '雷达扫描' }
        }
      ]
    },
    {
      path: 'draw',
      component: () => import('@/views/cesium/index'), // Parent router-view
      name: 'layer',
      meta: { title: '绘制示例' },
      redirect: '/cesium/draw/wall',
      children: [
        {
          path: 'wall',
          component: () => import('@/views/cesium/draw/wall'),
          name: 'wall-draw',
          meta: { title: '绘制墙' }
        }
      ]
    }
  ]
}

export default cesiumRouter
