import Layout from '@/layout'

const mapboxglRouter = {
  path: '/openlayers',
  component: Layout,
  redirect: '/openlayers/train',
  name: 'openlayers',
  meta: {
    title: 'openlayers示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'simple',
      component: () => import('@/views/openlayers/index'), // Parent router-view
      name: 'simple',
      meta: { title: '地图' },
      redirect: '/mapboxgl/map/3857',
      children: [
        {
          path: 'train',
          component: () => import('@/views/openlayers/train'),
          name: 'train',
          meta: { title: '铁路样式' }
        },
        {
          path: '4326',
          component: () => import('@/views/mapboxgl/map/map-4326'),
          name: '4326',
          meta: { title: '4326' }
        }
      ]
    }
  ]
}

export default mapboxglRouter
