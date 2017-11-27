import {playMode} from '../utils/config'
import {getHistory, saveTypes} from '../common/js/storage'

const state = {
  author: 'chen',
  focus: false,
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  userDisc: {},
  topList: [],
  searchHistory: getHistory(saveTypes.searchHistory),
  favorite: [],
  playHistory: getHistory(saveTypes.playHistory),
  // 是否正在显示播放列表
  playListShow: false,
  // 是否正在显示添加歌曲
  addSongShow: false,
  // 是否正在弹出确认窗口
  confirmShow: false
}

export default state
