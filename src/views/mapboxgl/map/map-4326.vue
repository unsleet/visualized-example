<template>
  <div id="container" style="width: 100%;height: 100%;" />
</template>
<script>
import mapboxgl from 'mapbox-gl'
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
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tileSize: 256,
              tiles: ['http://222.86.86.6:8660/EzServer7/Maps/zysl/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=1.0.0']
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        crs: 'EPSG:4326', // 或者 mapboxgl.CRS.EPSG4326  或者 new mapboxgl.CRS('EPSG:4326',[-180,-90,180,90]);
        center: [106.88513, 27.64558],
        zoom: 13
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-left')
    }
  }
}
</script>
