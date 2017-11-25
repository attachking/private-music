import * as types from './mutation-types'
import {addSearchHistory, getHistory, saveTypes, removeSearchHistory, insertFavorite, removeFavorite, removeAllFavorite, deletePlayHistory, removePlayHistory} from '../common/js/storage'
import {Song} from '../common/js/clazz'

export const setAuthor = function({commit, state}, name) {
  commit(types.SET_AUTHOR, name)
}
// 选择歌单某一项进行播放
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
}
// 添加新歌曲至当前播放索引的下一个,并播放该歌曲
export const addSong = function({commit, state}, item) {
  let arr = state.playList.slice(0)
  let check = checkSongs(arr, item.id)
  let index = state.currentIndex
  if (check === true) {
    // 如果当前列表中无重复歌曲
    arr.splice(state.currentIndex + 1, 0, item)
    index++
  } else if (check < state.currentIndex) {
    // 如果重复歌曲在当前播放歌曲之前
    arr.splice(state.currentIndex, 0, item)
  } else {
    // 如果重复歌曲为当前歌曲或在当前播放歌曲之后
    arr.splice(state.currentIndex + 1, 0, item)
    index++
  }
  commit(types.SET_PLAYLIST, arr)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING, true)
}

// 添加搜索历史记录
export const insertHistory = function({commit}, item) {
  addSearchHistory(item)
  commit(types.SET_SEARCH_HISTORY, getHistory(saveTypes.searchHistory))
}

// 删除某个搜索历史纪录
export const deleteSearch = function({commit}, index) {
  removeSearchHistory(index)
  commit(types.SET_SEARCH_HISTORY, getHistory(saveTypes.searchHistory))
}

// 清空搜索历史记录
export const removeAllSearch = function({commit}) {
  localStorage.removeItem(saveTypes.searchHistory)
  commit(types.SET_SEARCH_HISTORY, getHistory(saveTypes.searchHistory))
}

// 防止添加重复歌曲,去除重复歌曲
function checkSongs(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (id === list[i].id) {
      list.splice(i, 1)
      return i
    }
  }
  return true
}

// 选择播放列表某一项
export const selectList = function({commit}, index) {
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENT_INDEX, index)
}

// 删除播放列表其中一首歌
export const deleteSong = function({commit, state}, index) {
  let list = state.playList.slice(0)
  let currentIndex = state.currentIndex
  list.splice(index, 1)
  if (index < state.currentIndex) {
    currentIndex--
  }
  if (!list.length) {
    commit(types.SET_PLAYING, false)
    currentIndex = -1
  }
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYLIST, list)
}

// 删除列表所有歌曲
export const deleteSongsList = function({commit, state}) {
  commit(types.SET_PLAYING, false)
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
}

// 添加到/删除我喜欢
export const toggleFavorite = function({commit, state}, song) {
  let list = state.favorite.slice(0)
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  if (index === -1) {
    insertFavorite(song)
    // 从localStorage里取出的列表数据不是Song的实例,因此需要对每一项new Song()
    commit(types.SET_FAVORITE, getHistory(saveTypes.favorite).map((song) => new Song(song)))
  } else {
    list.splice(index, 1)
    removeFavorite(song)
    commit(types.SET_FAVORITE, list)
  }
}

// 清空我喜欢的列表
export const removeFavoriteList = function({commit, state}) {
  commit(types.SET_FAVORITE, [])
  removeAllFavorite()
}

// 删除一项播放历史记录
export const deleteHistory = function({commit, state}, song) {
  let list = state.playHistory.slice(0)
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  list.splice(index, 1)
  commit(types.SET_PLAY_HISTORY, list)
  deletePlayHistory(song)
}

// 删除所有播放历史记录
export const removeHistory = function({commit}) {
  removePlayHistory()
  commit(types.SET_PLAY_HISTORY, [])
}

// 添加一首歌到播放列表
export const addPlayList = function({commit, state}, song) {
  let list = state.playList.slice(0)
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  let currentIndex = state.currentIndex
  if (index !== -1) {
    list.splice(index, 1)
    if (index < currentIndex) currentIndex--
  }
  list.push(song)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYLIST, list)
}
