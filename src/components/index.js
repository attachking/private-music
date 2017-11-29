import mHeader from './m-header/m-header.vue'
import tab from './tab/tab.vue'
import slider from '../base/slider/slider.vue'
import scroll from '../base/scroll/scroll.vue'
import loading from '../base/loading/loading.vue'
import listView from '../base/list-view/list-view.vue'
import musicList from './music-list/music-list.vue'
import songsList from '../base/songs-list/songs-list.vue'
import player from './player/player.vue'
import progressBar from '../base/progress-bar/progress-bar.vue'
import progressCircle from '../base/progress-circle/progress-circle.vue'
import suggest from '../components/suggest/suggest.vue'
import searchBox from '../base/search-box/search-box.vue'
import noResult from '../base/no-result/no-result.vue'
import searchList from '../base/search-list/search-list.vue'
import confirm from '../base/confirm/confirm.vue'
import playList from './play-list/play-list.vue'
import addSong from './add-song/add-song.vue'
import switches from '../base/switches/switches.vue'
import topTip from '../base/top-tip/top-tip.vue'
import midTip from '../base/mid-tip/mid-tip.vue'
import fullImg from '../base/full-img/full-img.vue'
import userPlayList from './user-play-list/user-play-list.vue'

let components = [
  mHeader,
  tab,
  slider,
  scroll,
  loading,
  listView,
  musicList,
  songsList,
  player,
  progressBar,
  progressCircle,
  suggest,
  searchBox,
  noResult,
  searchList,
  confirm,
  playList,
  addSong,
  switches,
  topTip,
  midTip,
  fullImg,
  userPlayList
]

export default {
  install: (Vue) => {
    components.map(item => {
      Vue.component(item.name, item)
    })
  }
}
