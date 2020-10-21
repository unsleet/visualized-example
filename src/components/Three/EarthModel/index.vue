<template>
  <div id="container" class="container" />
<!--    <div id="container" class="earth-container" />-->
<!--  </div>-->
</template>
<script>
import SceneView from './scene/SceneView'
export default {
  name: 'Plant',
  mounted() {
    this.init()
  },
  methods: {
    init: function() {
      const sceneView = new SceneView(document.getElementById('container'))
      console.log(sceneView)
    }
  }
}
</script>
<style lang="scss">
  .container{
    width: 100%;
    height: 100%;
    overflow: hidden;/*
    background: #0c0604 url("~@/assets/earth/bg_loading.jpg") no-repeat center;*/
    background-size: cover;
    position: relative;
  }
  .earth-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20%;
    right: 20%;
  }
</style>
