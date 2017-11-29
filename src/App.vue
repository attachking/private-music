<template>
  <div id='app' @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <transition name='fade' mode='out-in'>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <play></play>
    <mid-tip text="再按一次退出" ref="midTip"></mid-tip>
    <full-img></full-img>
    <top-tip ref="topTip">
      <div class="app-tip-title">
        <i class="icon-ok"></i>
        <span class="text">{{tip}}</span>
      </div>
    </top-tip>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import event, {EVENT_TYPES} from './utils/event'

  export default {
    name: 'app',
    computed: {
      ...mapGetters([
        'fullScreen',
        'focus',
        'playListShow',
        'addSongShow',
        'confirmShow'
      ])
    },
    data() {
      return {
        isActive: true,
        tip: ''
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayListShow: 'SET_PLAY_LIST_SHOW',
        setAddSongShow: 'SET_ADD_SONG_SHOW'
      }),
      ...mapActions([
        'setUserPlayList'
      ]),
      // 设备准备完毕后
      onDeviceReady() {
        document.addEventListener('backbutton', this.onBackKeyDown, false)
        document.addEventListener('menubutton', this.onBackKeyDown, false)
      },
      // 监听返回键
      onBackKeyDown() {
        const name = this.$router.currentRoute.name
        if (!this.isActive) return
        if (this.focus) {
          // 当前如果正在调用手机输入法时，退出用户输入操作
          event.$emit(EVENT_TYPES.inputBlur)
        } else if (this.confirmShow) {
          // 当前确认窗口弹出状态时，关闭窗口
          event.$emit(EVENT_TYPES.confirmHide)
        } else if (this.fullScreen) {
          // 当播放器全屏时，退出全屏播放
          this.setFullScreen(false)
        } else if (this.addSongShow) {
          // 如果当前停留在添加歌曲页面时，退出添加歌曲
          this.setAddSongShow(false)
        } else if (this.playListShow) {
          // 当前如果正在显示播放列表时，退出播放列表显示
          this.setPlayListShow(false)
        } else if (name === 'recommend' || name === 'singer' || name === 'rank' || name === 'search') {
          // 按两次返回键退出逻辑
          this.showBackTip()
          // 注销返回键
          document.removeEventListener('backbutton', this.onBackKeyDown, false)
          document.removeEventListener('menubutton', this.onBackKeyDown, false)
          // 绑定退出事件
          document.addEventListener('backbutton', this.exitApp, false)
          document.addEventListener('menubutton', this.exitApp, false)
          // 3秒后重新注册返回事件
          this.timer = setInterval(() => {
            this.resetEvent()
          }, 3000)
        } else {
          // 否则执行浏览器回退
          this.$router.go(-1)
        }
      },
      exitApp() {
        navigator.app.exitApp()
      },
      showBackTip() {
        this.$refs.midTip.show()
      },
      hideTip() {
        this.$refs.midTip.hide()
      },
      resetEvent() {
        clearInterval(this.timer)
        this.hideTip()
        this.timer = null
        // 注销返回键
        document.removeEventListener('backbutton', this.exitApp, false)
        document.removeEventListener('menubutton', this.exitApp, false)
        // 返回键
        document.addEventListener('backbutton', this.onBackKeyDown, false)
        document.addEventListener('menubutton', this.onBackKeyDown, false)
      },
      pause() {
        this.isActive = false
      },
      resume() {
        setTimeout(() => {
          this.isActive = true
        }, 1000)
      }
    },
    watch: {
      $route() {
        if (this.timer) {
          this.resetEvent()
        }
      },
      fullScreen(newVal) {
        if (newVal) {
          this.resetEvent()
        }
      },
      focus(newVal) {
        if (newVal) {
          this.resetEvent()
        }
      },
      playListShow(newVal) {
        if (newVal) {
          this.resetEvent()
        }
      },
      addSongShow(newVal) {
        if (newVal) {
          this.resetEvent()
        }
      },
      confirmShow(newVal) {
        if (newVal) {
          this.resetEvent()
        }
      }
    },
    created() {
      document.addEventListener('deviceready', this.onDeviceReady, false)
      document.addEventListener('pause', this.pause, false)
      document.addEventListener('resume', this.resume, false)
      event.$on(EVENT_TYPES.tip, (text) => {
        this.tip = text
        this.$refs.topTip.show()
      })
      this.setUserPlayList()
    }
  }
</script>
<style scoped lang="less">
  @import "./common/styles/_vars.less";
  @import "./common/styles/_mixin.less";

  .app-tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: @font-size-medium;
      color: @color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: @font-size-medium;
      color: @color-text;
    }
  }
</style>
