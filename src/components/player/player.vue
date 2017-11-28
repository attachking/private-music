<template>
  <div class="player" v-show="playList.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
              </div>
              <p class="text" v-if="!currentLyric">{{playingLyric}}</p>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{timeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @progress-change="progressChange"></progress-bar>
            </div>
            <span class="time time-r">{{timeFormat(currentSong.duration, 'ms')}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeClass" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disabledClass">
              <i class="icon-prev" @click="pre"></i>
            </div>
            <div class="icon i-center" :class="disabledClass">
              <i :class="playIcon" @click="play"></i>
            </div>
            <div class="icon i-right" :class="disabledClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right" @click.stop.prevent="toggleFavorite(currentSong)">
              <i class="icon" :class="getFavoriteIcon()"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i @click.stop="play" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list v-model="showPlayList"></play-list>
    <audio :src="currentSong.url" ref="audio" @play="ready" @timeupdate="updateTime" @error="error" @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from '../../common/js/dom'
  import {playMode} from '../../utils/config'
  import Lyric from 'lyric-parser'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    name: 'play',
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentShow: 'cd',
        currentLineNum: 0,
        playingLyric: ''
      }
    },
    computed: {
      cdCls: {
        get() {
          return this.playing ? 'play' : 'play pause'
        }
      },
      playIcon: {
        get() {
          return this.playing ? 'icon-pause' : 'icon-play'
        }
      },
      miniIcon: {
        get() {
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        }
      },
      disabledClass: {
        get() {
          return this.songReady ? '' : 'disable'
        }
      },
      percent: {
        get() {
          return this.currentTime / (this.currentSong.duration / 1000)
        }
      },
      modeClass: {
        get() {
          return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
      },
      showPlayList: {
        get() {
          return this.playListShow
        },
        set(val) {
          this.setPlayListShow(val)
        }
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'favorite',
        'playListShow'
      ])
    },
    created() {
      this.touch = {}
    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        const {x, y, scale} = this.getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0 scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0 scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this.getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style['transition'] = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      pre() {
        if (!this.songReady) return
        let index = this.currentIndex - 1
        if (index === -1) index = this.playList.length - 1
        this.setCurrentIndex(index)
        this.songReady = false
      },
      next() {
        if (!this.songReady) return
        if (this.playList.length === 1) {
          this.loop()
        } else if (this.mode === playMode.random) {
          this.randomNext()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) index = 0
          this.setCurrentIndex(index)
          this.songReady = false
        }
      },
      ready() {
        this.songReady = true
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      error() {
        this.songReady = true
      },
      end() {
        if (this.playList.length === 1) {
          this.loop()
        } else if (this.mode === playMode.sequence) {
          this.next()
        } else if (this.mode === playMode.loop) {
          this.loop()
        } else if (this.mode === playMode.random) {
          // 随机播放
          this.randomNext()
        }
      },
      randomNext() {
        let index = Math.floor(Math.random() * this.playList.length)
        this.setCurrentIndex(index)
        this.songReady = false
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlaying(true)
        this.currentLyric.seek(0)
      },
      timeFormat(time, type) {
        if (type === 'ms') time = time / 1000
        time = time | 0
        let minute = time / 60 | 0
        let second = time % 60
        if (second < 10) second = '0' + second
        return `${minute}:${second}`
      },
      progressChange(percent) {
        let time = percent * (this.currentSong.duration / 1000)
        this.$refs.audio.currentTime = time
        this.currentLyric && this.currentLyric.seek(time * 1000)
      },
      changeMode() {
        this.setMode((this.mode + 1) % 3)
      },
      getUrl(song) {
        song.getUrl().then(() => {
          if (this.playing) {
            setTimeout(() => {
              this.songReady && this.$refs.audio.play()
            }, 20)
          }
        })
      },
      getLyric() {
        this.songReady = false
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
            this.currentLyric.seek(this.currentTime * 1000)
          }
          this.songReady = true
        }).catch(() => {
          this.songReady = true
          this.currentLyric = null
          this.playingLyric = this.currentSong.lyric
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        this.playingLyric = txt
        if (lineNum > 5) {
          this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum - 5], 1000)
        } else {
          this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[0], 1000)
        }
      },
      middleTouchStart(e) {
        this.touch.status = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      middleTouchMove(e) {
        if (!this.touch.status) return
        let offsetY = e.touches[0].pageY - this.touch.startY
        let offsetX = e.touches[0].pageX - this.touch.startX
        if (Math.abs(offsetY) > Math.abs(offsetX)) return
        let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        offsetX = Math.max(-window.innerWidth, Math.min(offsetX + left, 0))
        this.touch.percent = Math.abs(offsetX / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetX}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = ''
        this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
      },
      middleTouchEnd() {
        this.touch.status = false
        let offsetX
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetX = -window.innerWidth
            this.currentShow = 'lyric'
            this.$refs.middleL.style['opacity'] = 0
            this.touch.percent = 1
          } else {
            offsetX = 0
            this.currentShow = 'cd'
            this.$refs.middleL.style['opacity'] = 1
            this.touch.percent = 0
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetX = 0
            this.currentShow = 'cd'
            this.$refs.middleL.style['opacity'] = 1
            this.touch.percent = 0
          } else {
            offsetX = -window.innerWidth
            this.currentShow = 'lyric'
            this.$refs.middleL.style['opacity'] = 0
            this.touch.percent = 1
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetX}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `300ms`
        this.$refs.middleL.style[transitionDuration] = `300ms`
      },
      getPosAndScale() {
        let paddingLeft = 40
        let paddingTop = 80
        let paddingBottom = 30
        let targetWidth = 20
        let width = window.innerWidth * 0.8 / 2
        let x = -(window.innerWidth / 2 - paddingLeft)
        let y = window.innerHeight - width / 2 - paddingTop - paddingBottom
        let scale = targetWidth / width
        return {x, y, scale}
      },
      play() {
        this.setPlaying(!this.playing)
      },
      showList() {
        this.showPlayList = true
      },
      getFavoriteIcon() {
        let index = this.favorite.findIndex((item) => {
          return this.currentSong.id === item.id
        })
        if (index === -1) {
          return 'icon-not-favorite'
        } else {
          return 'icon-favorite'
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setMode: 'SET_MODE',
        setPlayListShow: 'SET_PLAY_LIST_SHOW'
      }),
      ...mapActions([
        'toggleFavorite'
      ])
    },
    watch: {
      playing(newVal) {
        this.$nextTick(() => {
          if (newVal) {
            this.songReady && this.$refs.audio.play()
            this.currentLyric && this.currentLyric.play()
            this.currentLyric && this.currentLyric.seek(this.currentTime * 1000)
          } else {
            this.$refs.audio.pause()
            this.currentLyric && this.currentLyric.stop()
          }
        })
      },
      currentSong(newVal, oldVal) {
        if (!newVal.id) return
        if (newVal.id === oldVal.id) return
        this.currentLyric && this.currentLyric.stop()
        this.playingLyric = ''
        this.currentLyric = null
        this.getUrl(newVal)
        // 兼容微信
        setTimeout(() => {
          if (this.playing) {
            this.songReady && this.$refs.audio.play()
          }
          this.getLyric()
          this.currentTime = 0
        }, 1000)
      },
      fullScreen(newVal) {
        if (newVal) {
          setTimeout(() => {
            // 全屏后刷新歌词
            this.$refs.lyricList.refresh()
            this.currentLyric && this.currentLyric.seek(this.currentTime * 1000)
          }, 20)
        }
      },
      songReady(newVal) {
        if (newVal && this.playing) {
          this.$nextTick(() => {
            this.$refs.audio.play()
          })
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          .no-wrap();
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current {
                color: @color-text;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: @color-theme;
            &.disable {
              color: @color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all 0.4s;
        .top, .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0)
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          margin-bottom: 2px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc {
          .no-wrap();
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
          color: @color-theme-d;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
