<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title">
        <p>{{nickname}}</p>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random" v-show="!noResult && currentIndex === 1">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="clear" v-show="currentIndex === 1">
        <span @click="showConfirm">
          <i class="icon-clear"></i>&nbsp;清空
        </span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="scroll" class="list-scroll" :data="discList" v-if="currentIndex === 0">
          <div class="list-inner">
            <div class="recommend-list">
              <ul>
                <li v-for="(val, key) in discList" class="item" @click="itemSelect(val)">
                  <div class="icon">
                    <img width="60" height="60" v-lazy="val.coverImgUrl">
                  </div>
                  <div class="text">
                    <h2 class="name" v-html="val.name"></h2>
                    <p class="desc">{{val.trackCount}}首歌曲</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="loading-container" v-show="loading">
              <loading></loading>
            </div>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <songs-list :del="true" :songs="playHistory" @select="selectSong" @delete="del"></songs-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
      <confirm ref="confirm" @confirm="clearAll" text="是否清空播放记录" confirmBtnText="清空"></confirm>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {playMode, ERR_OK} from '../../utils/config'
  import {playListMixin} from '../../common/js/mixin'
  import {post} from '../../utils/http'
  import {saveTypes, setUser} from '../../common/js/storage'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        switches: [
          {
            name: '我的歌单'
          },
          {
            name: '最近听的'
          }
        ],
        currentIndex: 0,
        discList: [],
        loading: true,
        nickname: ''
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'favorite'
      ]),
      noResultDesc: {
        get() {
          return this.currentIndex === 0 ? '暂无歌单' : '你还没有听过歌曲'
        }
      },
      noResult: {
        get() {
          return this.currentIndex === 0 ? !this.discList.length : !this.playHistory.length
        }
      }
    },
    methods: {
      ...mapActions([
        'selectPlay',
        'deleteHistory',
        'removeHistory',
        'getFavoriteList'
      ]),
      ...mapMutations({
        setMode: 'SET_MODE',
        setUserDisc: 'SET_USER_DISC'
      }),
      handlePlayList(list) {
        this.$refs.listWrapper.style.bottom = list.length > 0 ? '60px' : ''
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      random() {
        let list = this.currentIndex === 0 ? this.favorite : this.playHistory
        let index = Math.floor(Math.random() * list.length)
        this.selectPlay({
          list,
          index: index
        })
        this.setMode(playMode.random)
      },
      back() {
        this.$router.go(-1)
      },
      selectSong(song, index) {
        this.selectPlay({
          list: this.currentIndex === 0 ? this.favorite : this.playHistory,
          index: index
        })
      },
      del(song, index) {
        this.deleteHistory(song)
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      clearAll() {
        if (this.currentIndex === 0) {
          this.removeFavoriteList()
        } else {
          this.removeHistory()
        }
      },
      getDiscList() {
        post('/user/playlist', {}).then(data => {
          if (data.data.code === ERR_OK) {
            this.loading = false
            this.discList = data.data.playlist
            localStorage.setItem(saveTypes.favoriteId, data.data.playlist[0].id)
            if (!this.favorite.length) {
              this.getFavoriteList()
            }
          }
        })
      },
      itemSelect(val) {
        this.setUserDisc(val)
        this.$router.push({
          name: 'userPlaylistDetail',
          params: {
            id: val.id
          }
        })
      },
      getUserDetail() {
        post('/user/detail', {}).then(data => {
          if (data.data.code === ERR_OK) {
            setUser({
              id: data.data.profile.userId,
              nickName: data.data.profile.nickname
            })
            this.nickname = data.data.profile.nickname
          }
        })
      }
    },
    watch: {
      currentIndex(newVal) {
        setTimeout(() => {
          this.$refs.playList && this.$refs.playList.refresh()
          this.$refs.listWrapper.style.top = newVal === 0 ? '100px' : '170px'
        }, 20)
      },
      favorite(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.getDiscList()
        }
      }
    },
    mounted() {
      this.getDiscList()
      this.getUserDetail()
    },
    activated() {
      this.getDiscList()
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: @color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .title{
      margin: 15px 0 20px 0;
      color: @color-theme;
      text-align: center;
    }
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .switches-wrapper {
      margin: 10px 0 30px 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid @color-text-l;
      color: @color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
    .clear {
      text-align: right;
      padding: 0 30px;
      height: 20px;
    }
    .list-wrapper {
      position: absolute;
      top: 100px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
