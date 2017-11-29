import {playMode} from '../utils/config'
import {getHistory, saveTypes} from '../common/js/storage'
import {Song} from '../common/js/clazz'

const state = {
  author: 'chen',
  focus: false,
  singer: {},
  playing: false,
  fullScreen: false,
  // 播放列表
  playList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  // 推荐歌单详情
  disc: {},
  // 用户歌单详情
  userDisc: {},
  // 用户歌单
  userPlayList: [],
  // 排行列表
  topList: [],
  searchHistory: getHistory(saveTypes.searchHistory),
  favorite: [],
  playHistory: getHistory(saveTypes.playHistory).map(item => new Song(item)),
  // 是否正在显示播放列表
  playListShow: false,
  // 是否正在显示添加歌曲
  addSongShow: false,
  // 是否正在弹出确认窗口
  confirmShow: false
}

export default state
