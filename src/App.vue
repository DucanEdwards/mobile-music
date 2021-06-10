<template>
  <div id="app">
    <div class="tophead">
      <MHead></MHead>
      <Tab></Tab>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHead from './components/mhead.vue'
  import Tab from './components/tab'
  import Player from 'components/player'
  export default {
    name: 'app',
    data() {
      return {}
    },
    components:{
      MHead,
      Tab,
      Player
    }
  }
</script>

<style>
*{
  margin: 0px;
}
.tophead{
  position: fixed;
  width: 100%;
}
</style>