import * as types from './mutation-types'
import {insertPlayHistory, getHistory, saveTypes} from '../common/js/storage'
import {Song} from '../common/js/clazz'

const mutations = {
  [types.SET_SINGER](state, o) {
    state.singer = o
  },
  [types.SET_AUTHOR](state, o) {
    state.author = o
  },
  [types.SET_PLAYING](state, o) {
    state.playing = o
  },
  [types.SET_FULL_SCREEN](state, o) {
    state.fullScreen = o
  },
  [types.SET_PLAYLIST](state, o) {
    state.playList = o
  },
  [types.SET_MODE](state, o) {
    state.mode = o
  },
  [types.SET_CURRENT_INDEX](state, o) {
    if (o >= 0) {
      // 歌曲当前索引改变时记录至播放历史
      insertPlayHistory(state.playList[o])
      state.playHistory = getHistory(saveTypes.playHistory).map(item => new Song(item))
    }
    state.currentIndex = o
  },
  [types.SET_DISC](state, o) {
    state.disc = o
  },
  [types.SET_TOP_LIST](state, o) {
    state.topList = o
  },
  [types.SET_FOCUS](state, o) {
    state.focus = o
  },
  [types.SET_SEARCH_HISTORY](state, o) {
    state.searchHistory = o
  },
  [types.SET_FAVORITE](state, o) {
    state.favorite = o
  },
  [types.SET_PLAY_HISTORY](state, o) {
    state.playHistory = o
  },
  [types.SET_PLAY_LIST_SHOW](state, o) {
    state.playListShow = o
  },
  [types.SET_ADD_SONG_SHOW](state, o) {
    state.addSongShow = o
  },
  [types.SET_CONFIRM_SHOW](state, o) {
    state.confirmShow = o
  },
  [types.SET_USER_DISC](state, o) {
    state.userDisc = o
  }
}

export default mutations
