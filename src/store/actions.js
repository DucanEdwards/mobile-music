import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle} from "../common/js/util";
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from '../common/js/cache'

/**
 *
 * @param list
 * @param song
 * 当点击随机播放时，找出顺序播放时歌曲在随机播放列表里面的下标
 */
function findIndex(list,song) {
    return list.findIndex((item)=>{
        return item.id === song.id;
    })
}

export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list);
    //如果状态为随机播放，则将原有列表洗牌，否则就为当前列表
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList,list[index]);

    }else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};

/***
 * 插入歌曲到当前播放列表
 */
export const insertSong = function ({commit, state}, song) {
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    //记录当前歌曲
    let currentSong = playList[currentIndex];
    //查找播放列表中是否已经有待插入歌曲
    let fpIndex = findIndex(playList, song);
    //插入歌曲，索引加1
    currentIndex++;
    playList.splice(currentIndex, 0, song);
    //如果已经存在，插入后将之前有的一首删除
    if (fpIndex > -1) {
        //如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            playList.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playList.splice(fpIndex + 1, 1);
        }
    }
    let currentSIndex = findIndex(sequenceList, currentSong) + 1;
    let fsIndex = findIndex(sequenceList, song);
    sequenceList.splice(currentSIndex, 0, song);
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
        } else {
            sequenceList.splice(fsIndex + 1, 1);
        }
    }
    commit(types.SET_PLAYLIST, playList);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};


/**保存搜索历史
 *
 * @param commit
 * @param query
 */
export const saveSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};
/**
 * 删除搜索历史
 * @param commit
 * @param query
 */
export const deleteSearchHistory = function ({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};
/**
 * 清空搜索历史
 * @param commit
 */
export const clearSearchHistory = function ({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
};

/**
 * 删除播放列表的一首歌
 * @param commit
 * @param state
 * @param song
 */
export const deleteSong = function ({commit, state}, song) {
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    let pIndex = findIndex(playList, song);
    playList.splice(pIndex, 1);
    let sIndex = findIndex(sequenceList, song);
    sequenceList.splice(sIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--;
    }
    commit(types.SET_PLAYLIST, playList);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    //如果删除到最后一首歌，则将播放状态切为false
    const playingState = playList.length>0;
    commit(types.SET_PLAYING_STATE, playingState);
};
/**
 * 清空播放列表
 * @param commit
 */
export const deleteSongList = function ({commit}) {
    commit(types.SET_PLAYLIST, []);
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
};

/**
 * 将播放历史存至localStorage和vueX里面
 * @param commit
 * @param song
 */
export const savePlayHistory = function ({commit},song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song));
};

/**
 * 点击收藏歌曲
 * @param commit
 * @param song
 */
export const saveFavoriteList = function ({commit},song) {
    commit(types.SET_FAVORITE_LIST,saveFavorite(song));
};

export const deleteFavoriteList = function ({commit},song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
};
