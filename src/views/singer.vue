<template>
  <div class="singer" ref="singer">
    <scroll ref="scroll" class="singer-content" :data="singerList">
      <div>
        <p class="title">热门</p>
        <ul>
          <li v-for=" item in singerList" class="Singerlist" @click="selectSinger(item)">
            <div class="infoImg">
              <img  v-lazy="item.img1v1Url" class="imgInfo"/>
            </div>
            <div class="desc">
              <h2 class="name">{{item.name}}</h2>
              <span><Icon type="ios-flame-outline"/>{{item.score}}</span>
              <p><span style="color: rgb(102, 153, 204);">话题人数：{{item.topicPerson}}人</span></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!singerList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
// import BScroll from 'better-scroll';
import Scroll from 'components/scroll';
import Loading from 'components/loading'
import {mapMutations} from 'vuex'
import {playlistMixin} from '../common/js/mixin'

export default {
  mixins: [playlistMixin],
  name: "singer",
  data() {
    return {
      singerList: []
    }
  },
  components: {
    Loading,
    Scroll
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    loadSinger() {
      var v = this;
      v.$axios.get('/api/toplist/artist')
          .then(response => {
            //console.log(response.datalist.artists);
            if (response.data.code === 200) {
              v.singerList = response.data.list.artists;
              // v.$nextTick(() =>{
              //   if (!this.scroll) {
              //     this.scroll = new BScroll(this.$refs.singerWarpper, {
              //       click: true,
              //       probeType: 3
              //     });
              //     // console.log(this.scroll);
              //   } else {
              //     this.scroll.refresh();
              //   };
              // });
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    selectSinger(singer){
      this.$router.push({
        path:'/singer/singerDetail',
        query:{
          id:singer.id
        }
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created() {
    this.loadSinger()
  },
}
</script>

<style scoped>
.singer{
  position: fixed;
  width: 100%;
  top: 90px;
  bottom: 0;
}
.title{
  background: rgba(51,51,51,0.1);
  color:rgb(139,139,139);
  padding-left: 5px;
}
.singer-content{
  height: 100%;
  overflow: hidden;
}
.Singerlist{
  height: 100px;
  display: flex;
  border-bottom: solid #e6e6e6 1px;
}
.Singerlist .infoImg{
  flex: 1;
  margin-top: 5px;
  margin-left: 5px;
}
.Singerlist .infoImg img{
  width: 85px;
  height: 85px;
}
.Singerlist .desc{
  flex:3;
  margin-top: 15px;
}
.Singerlist .desc span{
  font-size: 15px;
}
</style>