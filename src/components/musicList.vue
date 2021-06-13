<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back">
<!--        <Icon type="md-arrow-back"/>-->
      </i>
    </div>
    <h1 class="title">{{singerInfo.name}}</h1>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll" :data="songList" class="list"
            ref="list">
      <div class="song-list-warpper">
        <song-list @select="selectItem" :songs="songList"></song-list>
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

const RESERVED_HEIGHT = 120;
export default {
  name: "musicList",
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      singerInfo: {},
      songList: [],
      scrollY: 0,
      probeType: 1
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.singerInfo.img1v1Url})`;
    }
  },
  methods: {
    loadSingerSong() {
      var v = this;
      let list=[];
      if (!v.id) {
        this.$router.push("/singer");
        return;
      }
      v.$axios.get('/api/artists', {
        params: {
          id: v.id
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {
          v.singerInfo = response.data.artist;
          list = response.data.hotSongs;
          v.filterSinger(list);
          v.formatSongs(list);
          console.log(v.songList);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    filterSinger(songList) {
      songList.forEach((s) => {
        let ret = [];
        let ar = '';
        s.ar.forEach((item) => {
          ret.push(item.name);
        });
        ar = ret.join('/');
        // console.log(ar);
        s.ar = ar;
      });
    },
    formatSongs(list){
      var  v = this;
      v.loadSongUrl(list);
    },
    loadSongUrl(list) {
      var v = this;
      var songsIds = '';
      var songUrlList = [];
      for (let i = 0; i < list.length; i++) {
        songsIds += list[i].id +',';
      }
      songsIds = songsIds.substring(0,songsIds.length-1);
      // console.log(songsIds);
      v.$axios.get('/api/song/url', {
        params: {
          id: songsIds
        }
      }).then(response => {
        // console.log(response.data.data);
        if (response.data.code === 200) {
          songUrlList = response.data.data;
          //console.log(songUrlList);
          v.manageSongList(list,songUrlList);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    manageSongList(list1,list2){
      var v = this;
      for (let i = 0;i<list1.length;i++){
        let song = {
          id:'',
          name:'',
          ar:'',
          al:'',
          imgURL:'',
          songURL:'',
          time:0
        };
        song.id = list1[i].id;
        song.name = list1[i].name;
        song.ar = list1[i].ar;
        song.al = list1[i].al.name;
        song.imgURL = list1[i].al.picUrl;
        song.time = list1[i].dt;
        for (let m = 0;m<list2.length;m++){
          if (list1[i].id === list2[m].id) {
            song.songURL = list2[m].url;
          }
        }
        v.songList.push(song);
      }
      // console.log("songList：");
      // console.log(v.songList);
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
    this.loadSingerSong();
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