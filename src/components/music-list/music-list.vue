<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="playShow" class="play" @click="randomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" :probe-type="3" :listen-scroll="true" @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <songs-list :rank="rank" :songs="songs" @select="select"></songs-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
  import {prefixStyle} from '../../common/js/dom'
  import {mapActions, mapMutations} from 'vuex'
  import {playListMixin} from '../../common/js/mixin'
  import {playMode} from '../../utils/config'

  const RESOLVED_HEIGHT = 40
  const transform = prefixStyle('transform')

  export default {
    name: 'music-list',
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        playShow: false
      }
    },
    watch: {
      songs(newVal) {
        if (newVal.length) {
          this.playShow = true
        }
      }
    },
    mounted() {
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.minHeight = -this.imgHeight + RESOLVED_HEIGHT
      // scroll为自定义组件,需要加上$el来获取dom
      this.$refs.list && (this.$refs.list.$el.style.top = `${this.imgHeight}px`)
    },
    computed: {
      bgStyle: {
        get() {
          return `background-image:url(${this.bgImage})`
        }
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      ...mapMutations({
        setMode: 'SET_MODE'
      }),
      back() {
        this.$router.go(-1)
      },
      scroll(pos) {
        let zIndex = 0
        let blur = 0
        let scale = 1
        let translate = Math.max(pos.y, this.minHeight)
        this.$refs.layer.style[transform] = `translate(0, ${translate}px)`
        if (pos.y < this.minHeight) {
          zIndex = 10
          this.$refs.bgImage.style['paddingTop'] = 0
          this.$refs.bgImage.style['height'] = `${RESOLVED_HEIGHT}px`
          this.playShow = false
        } else {
          this.$refs.bgImage.style['paddingTop'] = '70%'
          this.$refs.bgImage.style['height'] = 0
          this.playShow = true
        }
        let percent = Math.abs(pos.y / this.imgHeight)
        if (pos.y > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          scale = 1
          blur = Math.min(percent * 20, 20)
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style['zIndex'] = zIndex
        // 高斯模糊处理(ios)
        this.$refs.filter.style['backdropFilter'] = `blur(${blur}px)`
      },
      select(song, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      randomPlay() {
        let index = Math.floor(Math.random() * this.songs.length)
        this.selectPlay({
          list: this.songs,
          index: index
        })
        this.setMode(playMode.random)
      },
      handlePlayList(list) {
        this.$refs.list && (this.$refs.list.$el.style.bottom = list.length > 0 ? '60px' : 0)
        this.$refs.list && this.$refs.list.refresh()
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
    .back{
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back{
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .title{
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      .no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper{
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play{
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid @color-theme;
          color: @color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-medium-x;
          }
          .text{
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-small;
          }
        }
      }
      .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer{
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list{
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: @color-background;
      .song-list-wrapper{
        padding: 20px 30px;
      }
      .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
