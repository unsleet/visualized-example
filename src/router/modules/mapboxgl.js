import Layout from '@/layout'

const mapboxglRouter = {
  path: '/mapboxgl',
  component: Layout,
  redirect: '/mapboxgl/map/3857',
  name: 'Mapboxgl',
  meta: {
    title: 'Mapboxgl示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'map',
      component: () => import('@/views/mapboxgl/index'), // Parent router-view
      name: 'light',
      meta: { title: '地图' },
      redirect: '/mapboxgl/map/3857',
      children: [
        {
          path: '3857',
          component: () => import('@/views/mapboxgl/map/map-3857'),
          name: 'plant',
          meta: { title: '3857' }
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
