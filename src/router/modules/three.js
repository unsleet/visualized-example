import Layout from '@/layout'

const threeRouter = {
  path: '/three',
  component: Layout,
  redirect: '/three/light/plant',
  name: 'Three',
  meta: {
    title: 'three示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'light',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'light',
      meta: { title: '灯光示例' },
      redirect: '/three/light/plant',
      children: [
        {
          path: 'glow',
          component: () => import('@/views/three/light/glow/index'),
          name: 'glow',
          meta: { title: '辉光' },
          children: [
            {
              path: 'sphere',
              component: () => import('@/views/three/light/glow/sphere-glow/index'),
              name: 'sphere',
              meta: { title: '球形' }
            },
            {
              path: 'box',
              component: () => import('@/views/three/light/glow/box-glow/index'),
              name: 'sphere',
              meta: { title: '矩形' }
            },
            {
              path: 'plant',
              component: () => import('@/views/three/light/glow/plant-glow/index'),
              name: 'plant',
              meta: { title: '平面' }
            }
          ]
        },
        {
          path: 'transparent-lignt',
          component: () => import('@/views/three/light/transparent-light/index'),
          name: 'transparent-lignt',
          meta: { title: '透明灯光' }
        },
        {
          path: 'plant',
          component: () => import('@/views/three/light/plant/index'),
          name: 'plant',
          meta: { title: '行星' }
        },
        {
          path: 'plant1',
          component: () => import('@/views/three/light/test/index'),
          name: 'plant1',
          meta: { title: '灯光' }
        },
        {
          path: 'shock-wave',
          component: () => import('@/views/three/light/shock-wave/index'),
          name: 'shockWave',
          meta: { title: '冲击波' }
        }
      ]
    },
    {
      path: 'materials',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'materials',
      meta: { title: '材质' },
      redirect: '/three/materials/basic',
      children: [
        {
          path: 'basic',
          component: () => import('@/views/three/materials/basic/index'),
          name: 'basic',
          meta: { title: '基本' },
          children: [
            {
              path: 'materials_basic',
              component: () => import('@/views/three/materials/basic/materials_basic/index'),
              name: 'materials_basic',
              meta: { title: '基本材质' }
            },
            {
              path: 'box',
              component: () => import('@/views/three/light/glow/box-glow/index'),
              name: 'sphere',
              meta: { title: '矩形' }
            }
          ]
        },
        {
          path: 'index',
          component: () => import('@/views/three/light/transparent-light/index'),
          name: 'index',
          meta: { title: '透明灯光' }
        }
      ]
    },
    {
      path: 'earth',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'earth',
      meta: { title: '地球' },
      redirect: '/three/earth/model',
      children: [
        {
          path: 'model',
          component: () => import('@/views/three/earth/model/index'),
          name: 'model',
          meta: { title: '基础模型' }
        },
        {
          path: 'geojson',
          component: () => import('@/views/three/earth/geojson/index'),
          name: 'geojson',
          meta: { title: 'GeoJson' }
        },
        {
          path: 'model1',
          component: () => import('@/views/three/light/test/index'),
          name: 'model1',
          meta: { title: '飞行' }
        }
      ]
    },
    {
      path: 'effect-composer',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'composer',
      meta: { title: '后期渲染' },
      redirect: '/three/effect-composer/render',
      children: [
        {
          path: 'render',
          component: () => import('@/views/three/effect-composer/render-pass/index'),
          name: 'render',
          meta: { title: 'RenderPass' }
        },
        {
          path: 'model1',
          component: () => import('@/views/three/light/test/index'),
          name: 'model1',
          meta: { title: '飞行' }
        }
      ]
    },
    {
      path: 'city',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'city',
      meta: { title: '智慧城市' },
      redirect: '/three/city/obj',
      children: [
        {
          path: 'obj',
          component: () => import('@/views/three/city/obj/index'),
          name: 'obj',
          meta: { title: '加载OBJ模型' }
        },
        {
          path: 'model1',
          component: () => import('@/views/three/light/test/index'),
          name: 'model1',
          meta: { title: '飞行' }
        }
      ]
    },
    {
      path: 'animation',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'animation',
      meta: { title: '动画效果' },
      redirect: '/three/animation/uv',
      children: [
        {
          path: 'uv',
          component: () => import('@/views/three/animation/uv/index'),
          name: 'uv',
          meta: { title: 'UV动画' }
        },
        {
          path: 'circle-ripple',
          component: () => import('@/views/three/animation/circle/circle-ripple'),
          name: 'circle-ripple',
          meta: { title: '圆形扩散' }
        },
        {
          path: 'circle-ring',
          component: () => import('@/views/three/animation/circle/circle-ring'),
          name: 'circle-ring',
          meta: { title: '圆环扩散' }
        },
        {
          path: 'radar-line',
          component: () => import('@/views/three/animation/circle/radar-line'),
          name: 'radar-line',
          meta: { title: '雷达线性' }
        },
        {
          path: 'radar-other',
          component: () => import('@/views/three/animation/circle/radar-other'),
          name: 'radar-other',
          meta: { title: '雷达其他' }
        },
        {
          path: 'spread-ball',
          component: () => import('@/views/three/animation/circle/spread-ball'),
          name: 'spread-ball',
          meta: { title: '球形扩散' }
        },
        {
          path: 'model1',
          component: () => import('@/views/three/light/test/index'),
          name: 'model1',
          meta: { title: '飞行' }
        }
      ]
    },
    {
      path: 'other',
      component: () => import('@/views/three/index'), // Parent router-view
      name: 'other',
      meta: { title: '其它' },
      redirect: '/three/other/index',
      children: [
        {
          path: 'custom',
          component: () => import('@/views/three/other/custom/index'),
          name: 'custom',
          meta: { title: '自定义' },
          children: [
            {
              path: 'crystal',
              component: () => import('@/views/three/other/custom/crystal/index'),
              name: 'crystal',
              meta: { title: '水晶' }
            },
            {
              path: 'box',
              component: () => import('@/views/three/light/glow/box-glow/index'),
              name: 'sphere',
              meta: { title: '矩形' }
            }
          ]
        },
        {
          path: 'index',
          component: () => import('@/views/three/light/transparent-light/index'),
          name: 'index',
          meta: { title: '透明灯光' }
        }
      ]
    }
  ]
}

export default threeRouter
