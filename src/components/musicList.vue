<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back">
<!--        <Icon type="md-arrow-back"/>-->
      </i>
    </div>
    <h1 class="title" v-html="title"></h1>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songList" class="list"
            ref="list">
      <div class="song-list-warpper">
        <song-list @select="selectItem" :rankflag="rankflag" :songs="songList"></song-list>
      </div>
      <div v-show="!songList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "./scroll";
import SongList from "./songList";
import Loading from "./loading";
import {mapActions} from 'vuex'
import {playlistMixin} from '../common/js/mixin'

const RESERVED_HEIGHT = 120;
export default {
  mixins: [playlistMixin],
  name: "musicList",
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    bgImage: {
      type: String,
      default: ''
    },
    songList: {
      type: Array,
      default: [],
      required: true
    },
    rankflag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // singerInfo: {},
      // songList: [],
      scrollY: 0,
      probeType: 1
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    handlePlayList(playList){
      const bottom = playList.length > 0? '60px' :'';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    back(){
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item,index){
      var v = this;
      // console.log(index)
      v.selectPlay({
        list: v.songList,
        index:index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  created() {
    // this.loadSingerSong();
    this.probeType = 3;
    this.listenScroll = true;
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
      this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`;
      //设置图片拖动放大缩小效果
      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = percent+1;
        zIndex = 10;
      }else {
        blur = Math.min(20 * percent,20);
      }
      //ios高斯模糊效果
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`;
      this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;

      } else {
        //console.log(newY+","+this.minTranslateY);
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style['transform'] = `scale(${scale})`;
      this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`;
    }
  },
  mounted(){
    // console.log(this.$refs.bgImage.clientHeight);
    this.imageHeight = this.$refs.bgImage.clientHeight;
    // this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
}
</script>

<style scoped>
@import '../common/css/icon.css';
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}

.icon-back {
  display: block;
  padding: 10px;
  font-size: 22px;
  color: rgba(0, 184, 148,1.0);
}

.title {
  position: absolute;
  top: 0;
  left: 10%;
  z-index: 40;
  width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: rgba(0, 184, 148,0.8);
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: cover;
}

.filter{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.3);
}

.list{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.song-list-warpper{
  /*padding: 20px;*/
  padding-left: 30px;
}

.bg-layer {
  position: relative;
  height: 100%;
  background: #fff
}
</style>