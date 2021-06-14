<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="item in result">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}}</p>
        </div>
      </li>
      <loading v-show="hasMore" :title="title"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../components/scroll';
import Loading from '../components/loading'
import NoResult from '../components/no-result'
import {mapActions} from 'vuex'

export default {
  name: "suggest-box",
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: 1, //搜索分页
      pageTotal: -1, //总分页数
      result: [],
      pullup: true, //是否启用上拉加载
      hasMore: true,  //是否有更多结果
      songCount: 0, // 搜索结果总数
      title: '',
      beforeScroll: true,
      insertSongUrl: '',
      insertSongDetail: {},
      waitInsertSong:{} //格式化之后的待插入歌曲
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    search(keywords, page) {
      var v = this;
      v.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      v.$axios.get('api/search', {
        params: {
          keywords: keywords,
          limit: 20,
          offset: page - 1,
        }
      }).then(response => {
        // console.log(response);
        if (response.data.code === 200) {
          v.songCount = response.data.result.songCount;
          if (v.songCount>0){
            v.result = response.data.result.songs;
          }
          // console.log(v.result);
          if (v.pageTotal === -1 && v.result.length !== 0) {
            v.pageTotal = v.songCount % (v.result.length);
            if (v.pageTotal === 0) {
              v.pageTotal = v.songCount / (v.result.length);
            } else {
              v.pageTotal = (v.songCount / (v.result.length) + 1);
            }
          }
          v.checkMore(v.pageTotal);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    loadMore(keywords, page) {
      var v = this;
      v.hasMore = true;
      v.$axios.get('api/search', {
        params: {
          keywords: keywords,
          limit: 20,
          offset: page - 1,
        }
      }).then(response => {
        //console.log(response);
        if (response.data.code === 200) {
          v.songCount = response.data.result.songCount;
          v.result = v.result.concat(response.data.result.songs);
          //console.log(v.result);
          v.checkMore(v.pageTotal);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      } else {
        this.page++;
        this.loadMore(this.query, this.page);
        // this.checkMore();
      }
    },
    listScroll(){
      this.$emit('listScroll');
    },
    /**
     * 如果当前返回值没有songList字段或者当前页数加1已经大于总页数
     * 则不能再进行上拉加载
     * @param pageTotal
     */
    checkMore(pageTotal) {
      //console.log(this.page);
      if ((this.page + 1) > pageTotal) {
        this.hasMore = false;
      }
    },
    /**
     * 传入歌曲id，获取歌曲播放地址
     * @param list
     */
    loadSongUrl(song) {
      var v = this;
      return v.$axios.get('api/song/url', {
        params: {
          id: song.id
        }
      });
    },
    loadSongDetail(song) {
      var v = this;
      return v.$axios.get('api/song/detail', {
        params: {
          ids: song.id
        }
      });
    },
    selectItem(song) {
      //TODO 获取歌曲URL和detail之后再将歌曲插入到vuex里面
      var v =this;
      let songDetail = {};
      return v.$axios.all([v.loadSongUrl(song),v.loadSongDetail(song)])
          .then(v.$axios.spread((resUrl,resDetail) =>{
            v.insertSongUrl = resUrl.data.data[0].url;
            songDetail = resDetail.data.songs[0];
            // console.log(v.insertSongUrl)
            // console.log(songDetail)
            v.filterSinger(songDetail);
            v.insertSongDetail = songDetail;
            v.manageSongInfo(v.insertSongUrl,v.insertSongDetail);
            // console.log(v.waitInsertSong);
            v.insertSong(v.waitInsertSong);
            //派发select事件给父组件
            v.$emit('select', v.waitInsertSong);
          })).catch(error =>{
            console.log(error);
          });
    },
    manageSongInfo(songurl, songDetail) {
      // console.log(songDetail);
      // console.log(songurl);
      let song = {
        id: '',
        name: '',
        ar: '',
        al: '',
        imgURL: '',
        songURL: '',
        time: 0
      };
      song.id = songDetail.id;
      song.name = songDetail.name;
      song.ar = songDetail.ar;
      song.al = songDetail.al.name;
      song.imgURL = songDetail.al.picUrl;
      song.time = songDetail.dt;
      song.songURL = songurl;
      this.waitInsertSong = song;
    },
    filterSinger(song) {
      let ret = [];
      let ar = '';
      song.ar.forEach((item) => {
        ret.push(item.name);
      });
      ar = ret.join('/');
      song.ar = ar;
    },
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.result = [];
      this.page = 1;
      this.pageTotal = -1;
      this.songCount = 0;
      if (this.query) {
        this.search(this.query, this.page);
      }
    }
  }
}
</script>

<style scoped>
@import '../common/css/icon.css';

.suggest {
  margin-top: 20px;
  height: 100%;
  overflow: hidden;
}

.suggest-list {
  padding: 0 30px;
}

.suggest-item {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.suggest-item .icon {
  flex: 0 0 30px;
  width: 30px;
  font-size: 17px;
  /*color: $color-text-d*/
}

.icon-music {
  font-size: 17px;
}

.suggest-item .name {
  flex: 1;
  width: 90%;
  font-size: 14px;
  /*color: $color-text-d*/
  /*overflow: hidden;*/
}

.suggest-item .name .text {
  white-space: nowrap;
}

.no-result-wrapper {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

</style>