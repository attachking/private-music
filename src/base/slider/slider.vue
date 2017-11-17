<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import $ from 'jquery'

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        slider: '',
        currentPageIndex: 0,
        dots: [],
        timer: '',
        children: []
      }
    },
    methods: {
      initWidth(isResize) {
        let children = $(this.$refs.sliderGroup).children()
        this.children = children
        children.addClass('slider-item')
        let width = 0
        let sliderWidth = $(this.$refs.slider).width()
        for (let i = 0; i < children.length; i++) {
          width += sliderWidth
          children.eq(i).width(sliderWidth)
        }
        if (this.loop && !isResize) width += sliderWidth * 2
        $(this.$refs.sliderGroup).width(width)
      },
      initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          // 是否开启惯性
          momentum: false,
          // 开启轮播模式
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
          let index = this.slider.getCurrentPage().pageX
          if (this.loop) {
            index -= 1
          }
          this.currentPageIndex = index

          if (this.autoPlay) {
            this.play()
          }
        })
        // 无论手动滑动还是自动滑动,滚动开始前清理定时器
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      initDots() {
        this.dots = new Array(this.children.length)
      },
      play() {
        let index = this.currentPageIndex + 1
        if (this.loop) {
          index += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(index, 0, 400)
        }, this.interval)
      }
    },
    mounted() {
      setTimeout(() => {
        this.initWidth()
        this.initDots()
        this.initSlider()
        if (this.autoPlay) {
          this.play()
        }
        window.addEventListener('resize', () => {
          // 只有在本页面监控到resize事件时执行
          if (!this.slider || this.$route.name !== 'recommend') return
          this.initWidth(true)
          this.slider.refresh()
        })
      }, 20)
    },
    activated() {
      // 再次激活本页时重新计算宽度
      this.initWidth(true)
      this.slider.refresh()
      if (this.autoPlay) {
        this.play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .slider {
    min-height: 1px;
    overflow: hidden;
    position: relative;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
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
  }
</style>
