<template>
  <transition name="slide">
    <div class="user-center">
      <div class="themebackgroud">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <!--切换组件-->
        <div class="switches-wrapper">
          <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        </div>
        <!-- 歌曲列表 -->
        <div class="list-wrapper" ref="listWrapper">
          <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
            <div class="list-inner">
              <song-list :songs="favoriteList" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from './switches'
import Scroll from './scroll'
import SongList from './songList'
import NoResult from './no-result'
import {mapGetters, mapActions} from 'vuex'
import {playlistMixin} from '../common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory',
    ])
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      //网易云的歌曲播放地址有时间检测,所以需要重新获取
      this.loadSongUrl(song.id).then(response => {
        // console.log(response.data.data[0].url);
        if (response.data.code === 200) {
          let newSong = {
            id: '',
            name: '',
            ar: '',
            al: '',
            imgURL: '',
            songURL: '',
            time: 0
          };
          newSong.al = song.al;
          newSong.ar = song.ar;
          newSong.id = song.id;
          newSong.imgURL = song.imgURL;
          newSong.name = song.name;
          newSong.time = song.time;
          newSong.songURL = response.data.data[0].url;
          this.insertSong(newSong);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    loadSongUrl(id) {
      var v = this;
      return v.$axios.get('api/song/url', {
        params: {
          id: id
        }
      });
    },
    back() {
      this.$router.back();
    },
    ...mapActions([
      'insertSong',
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>

<style scoped>
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #fff;
}

.themebackgroud {
  width: 100%;
  height: 100%;
  background: rgba(22, 160, 133,0.1);
}

.back {
  position: absolute;
  top: 10px;
  left: 6px;
  z-index: 50;
}

.icon-back {
  display: block;
  padding: 10px;
  font-size: 20px;
}

.switches-wrapper {
  padding: 10px 0 20px 0;
}

.text {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
}

.list-wrapper {
  position: absolute;
  top: 110px;
  bottom: 0;
  width: 100%;
}

.list-wrapper .list-scroll {
  height: 100%;
  overflow: hidden;
}

.list-wrapper .list-scroll .list-inner {
  padding: 20px 30px;
}

.no-result-wrapper {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

</style>