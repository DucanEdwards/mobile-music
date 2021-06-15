<template>
  <div class="mhead theme">
    <span class="icon"><Icon type="ios-musical-notes-outline"/></span>
    <h2 class="text">Music</h2>
    <span class="icon"><Icon type="ios-musical-notes-outline"/></span>
    <div class="iconimg" @click="toMenu">
      <Icon type="md-menu"/>
    </div>
    <div>
      <Drawer width="100" v-model="drawer">
        <div style="position: relative;top: 40px">
          <div style="width: 100%;margin-bottom: 20px">
            <img src="../common/images/music.jpg" style="width: 100%;height: auto"/>
          </div>
          <CellGroup>
            <div @click="closeDrawer">
              <Cell title="最近播放" to="user-center"/>
            </div>
            <div @click="closeDrawer">
              <Cell title="我的收藏" to="user-center"/>
            </div>
          </CellGroup>
        </div>
      </Drawer>
    </div>
  </div>
</template>

<script>

export default {
  name: "mhead",
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
    toMenu() {
      this.drawer = true;
    },
    closeDrawer(){
      this.drawer = false;
    }
  }
}
</script>

<style scoped>
.mhead {
  position: relative;
  height: 44px;
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.theme {
  background: #00b894;
}

.mhead .iconimg {
  position: absolute;
  display: inline-block;
  margin-top: 6px;
  right: 10px;
  width: 30px;
  height: 32px;
  font-size: 20px;
  border-radius: 50%;
  background-size: 28px 28px;

}

.mhead .text {
  display: inline-block;
  vertical-align: top;
  margin-top: 6px;
  line-height: 30px;
  font-size: 18px;
}

.mhead .icon {
  margin-top: 6px;
  display: inline-block;
  vertical-align: top;
  line-height: 30px;
  font-size: 18px;
}
</style>