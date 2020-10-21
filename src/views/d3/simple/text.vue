<template>
  <div class="adjustment-container">
    <div style="position: absolute;top: 50px;left: 50px;">
      <svg>
        <g class="header">
          <marker id="arrow" markerUnits="userSpaceOnUse"
                  viewBox="0 -5 10 10" refX="6" refY="0" markerWidth="7"
                  markerHeight="10" orient="auto" stroke-width="2">
            <path d="M0,-5L10,0L0,5" fill="#47E9F8" />
          </marker>
        </g>
      </svg>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import { getTextWidth } from '../d3-util'
export default {
  name: 'D3Text',
  mounted() {
    // 获取画布宽高
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    // 创建容器
    const svg = d3.select(this.$el).select('svg').attr('width', this.width).attr('height', this.height)
    this.container = svg.append('g')

    const data = [{ title: 'JFK撒', status: '1' }, { title: 'DSSAFWS', status: '2' }]
    const links = []

    const fontSize = '16px'
    let width = 0
    data.map((item, i) => {
      item.len = getTextWidth(item.title, fontSize) + 20
      item.width = width

      const start = width + item.len
      const end = start + 90
      if (i < data.length - 1) {
        links.push({ source: { x: start, y: 20 }, target: { x: end, y: 20 } })
      }
      width = end
    })

    const texts = this.container.selectAll('g.header').data(data)

    const gtexts = texts.enter().append('g').attr('class', 'header')
      .attr('transform', function(d, i) { return `translate(${d.width}, 0)` })
    gtexts.append('rect')
      .attr('width', function(d, i) { return d.len })
      .attr('x', 0)
      .attr('height', 40)
      .attr('fill', 'transparent ')
    gtexts.append('foreignObject')
      .attr('width', function(d, i) { return d.len })
      .attr('height', 40)
      .html((d) => {
        return this.createDomLabel(d)
      })

    const linkPath = this.container.selectAll('path.link').data(links).enter()
    linkPath.append('path')
      .style('stroke', '#47E9F8')
      // .style('stroke-dasharray', '2, 2')
      .style('stroke-width', 2)
      .attr('d', (d) => {
        return 'M '+ d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
      }).attr('marker-end', 'url(#arrow)')
  },
  methods: {
    createDomLabel(item) {
      let className = 'unexecuted'
      if (item.status === '1') {
        className = 'inProgress'
      } else if (item.status === '2') {
        className = 'executed'
      }
      const labelArr = []
      labelArr.push(`<div class="master-node ${ className }" style="width: ${ item.len }px; height: 40px;">`)
      labelArr.push(`<div class="master-label">`)
      labelArr.push(`<span>${ item.title }</span></div></div>`)
      return labelArr.join('')
    }
  }
}
</script>
<style lang="scss">
  .adjustment-container{
    background: #01416A;
    opacity: 0.8;
  }
  .master-node {
    position: relative;
    background: #033758;
    z-index: 0;
    cursor: pointer;
    .master-label {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      line-height: 40px;
      text-align: center;
      border-radius:2px;
      font-weight: 800;
      font-size: 14px;
      z-index: 1;
    }
  }
  .master-node.unexecuted {
    .master-label {
      border: 2px solid #EE778D;
      box-shadow: inset 0 0 5px 1px #EE778D;
      span {
        background: linear-gradient(0deg, #CB6D85 0%, rgba(255,255,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .master-node.inProgress {
    .master-label {
      border: 2px solid rgba(91, 225, 237, 1);
      box-shadow: inset 0 0 5px 1px rgba(91, 225, 237, 1);
      span {
        background: linear-gradient(0deg,rgba(23,194,230,1) 0%, rgba(255,255,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .master-node.executed {
    .master-label {
      border: 2px solid #18F5CE;
      box-shadow: inset 0 0 5px 1px #18F5CE;
      span {
        background: linear-gradient(0deg, #15D9BD 0%, rgba(255,255,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .master-node:hover {
    .corner-image {
      display: block;
    }
  }
  .master-node.inProgress:hover {
    box-shadow: inset 0 0 24px 1px rgba(91, 225, 237, 1);
  }
  .master-node.executed:hover {
    box-shadow: inset 0 0 24px 1px #18F5CE;
  }
  .master-node.unexecuted:hover {
    box-shadow: inset 0 0 24px 1px #EE778D;
  }
</style>
