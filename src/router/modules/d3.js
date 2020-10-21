import Layout from '@/layout'

const d3Router = {
  path: '/d3',
  component: Layout,
  redirect: '/d3/simple',
  name: 'd3',
  meta: {
    title: 'd3示例',
    icon: 'nested'
  },
  children: [
    {
      path: 'simple',
      component: () => import('@/views/d3/simple/index'), // Parent router-view
      name: 'simple',
      meta: { title: '地图' },
      redirect: '/d3/simple/text',
      children: [
        {
          path: 'text',
          component: () => import('@/views/d3/simple/text'),
          name: 'text',
          meta: { title: '文字' }
        }
      ]
    }
  ]
}

export default d3Router
