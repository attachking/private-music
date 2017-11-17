<template>
  <div class="progress-bar" ref="progressBar" @click.prevent="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="touchMove" @touchend.stop.prevent="touchEnd" @click.stop>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from '../../common/js/dom'

  const transform = prefixStyle('transform')
  const BTN_WIDTH = 16

  export default {
    name: 'progress-bar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      touchStart(e) {
        this.touch.status = true
      },
      touchMove(e) {
        if (!this.touch.status) return
        this.touch.isMove = true
        let barWidth = this.$refs.progressBar.clientWidth
        this.progressBarChange(e.touches[0].pageX - (window.innerWidth - barWidth) / 2)
      },
      touchEnd(e) {
        if (!this.touch.isMove) return
        let barWidth = this.$refs.progressBar.clientWidth
        this.touch.status = false
        this.touch.isMove = false
        this.$emit('progress-change', this.offset / barWidth)
      },
      progressClick(e) {
        let barWidth = this.$refs.progressBar.clientWidth
        this.progressBarChange(e.pageX - (window.innerWidth - barWidth) / 2)
        this.$emit('progress-change', this.offset / barWidth)
      },
      progressBarChange(offset) {
        let barWidth = this.$refs.progressBar.clientWidth
        offset -= BTN_WIDTH / 2
        let _offset = Math.min(barWidth - BTN_WIDTH / 2, Math.max(offset, 0))
        this.offset = _offset + BTN_WIDTH / 2
        this.$refs.progress.style.width = `${_offset}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${_offset}px, 0, 0)`
      }
    },
    watch: {
      percent(newVal) {
        if (!this.touch.status) {
          let barWidth = this.$refs.progressBar.clientWidth
          let paddingLeft = barWidth * newVal
          this.progressBarChange(paddingLeft)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .progress-bar{
    height: 30px;
    .bar-inner{
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress{
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background: @color-theme;
        }
      }
    }
  }
</style>
