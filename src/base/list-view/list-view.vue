<!--歌手列表组件-->
<template>
  <scroll :data="data" class="listview" ref="listview" :listen-scroll="true" @scroll="listenScroll" :probe-type="3">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="item in group.items" class="list-group-item" @click="setSinger(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item" :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="showFixed">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
  import $ from 'jquery'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    name: 'list-view',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: 0,
        showFixed: true,
        translate: 0
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      shortcutList: {
        get () {
          // map跟forEach的区别在于map返回一个新数组
          return this.data.map((item) => {
            return item.title.substr(0, 1)
          })
        }
      },
      fixedTitle: {
        get() {
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
      }
    },
    methods: {
      onShortcutTouchMove(e) {
        if (this.touch.y1 === undefined) return
        this.touch.y2 = e.touches[0].pageY
        let dis = this.touch.y2 - this.touch.y1
        let index = Math.floor(dis / ANCHOR_HEIGHT)
        this.scrollTo(this.touch.index + index)
      },
      onShortcutTouchStart(e) {
        let index = $(e.target).attr('data-index')
        if (!index) return
        this.scrollTo(Number(index))
        this.touch.index = Number(index)
        this.touch.y1 = e.touches[0].pageY
      },
      scrollTo(index) {
        if (index < 0 || index >= this.shortcutList.length) return
        if (this.currentPageIndex === index) return
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        this.currentIndex = index
      },
      listenScroll(pos) {
        if (pos.y > 0) {
          this.showFixed = false
        } else {
          this.showFixed = true
        }
        this.scrollY = Math.abs(pos.y)
      },
      calculateHeight() {
        let list = this.$refs.listGroup
        let height = 0
        for (let i = 0; i < list.length; i++) {
          height += $(list[i]).innerHeight()
          if (this.scrollY < height) {
            this.currentIndex = i
            break
          }
        }
      },
      calculateDiff() {
        let index = this.currentIndex
        let list = this.$refs.listGroup
        let height = 0
        for (let i = 0; i < index + 1; i++) {
          height += $(list[i]).innerHeight()
        }
        let translate
        if (this.scrollY > height - TITLE_HEIGHT && this.scrollY < height) {
          translate = height - TITLE_HEIGHT - this.scrollY
        } else {
          translate = 0
        }
        if (this.translate === translate) return
        this.$refs.fixed.style.transform = `translate(0, ${translate}px)`
        this.translate = translate
      },
      setSinger(singer) {
        this.$emit('select', singer)
      },
      refresh() {
        this.$refs.listview.refresh()
      }
    },
    watch: {
      scrollY() {
        this.calculateHeight()
        this.$nextTick(() => {
          this.calculateDiff()
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .list-group {
      padding-bottom: 30px;
      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current {
          color: @color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
