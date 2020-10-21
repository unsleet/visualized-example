<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
export default {
  name: 'Plant',
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      var map = new mapboxgl.Map({
        container: 'container', // container id
        style: {
          'version': 8,
          'sources': {
            'raster-tiles': {
              'attribution': '天地图',
              'type': 'raster',
              'tiles': ['https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China/zxyTileImage.png?z={z}&x={x}&y={y}'],
              'tileSize': 256
            }
          },
          'layers': [{
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles',
            'minzoom': 0,
            'maxzoom': 22
          }]
        },
        center: [120.143, 30.236], // starting position
        zoom: 3 // starting zoom
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-left')
    }
  }
}
</script>
