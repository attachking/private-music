<template>
  <div class="tipBox" v-show="showTip" ref="tipBox">
    <span class="tip">{{text}}</span>
  </div>
</template>
<script>
  export default {
    name: 'mid-tip',
    props: {
      text: {
        type: String,
        default: ''
      },
      duration: {
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        showTip: false,
        timer: null
      }
    },
    methods: {
      show() {
        this.showTip = true
        setTimeout(() => {
          this.$refs.tipBox.style.opacity = 1
          this.timer = setTimeout(() => {
            this.hide()
          }, this.duration)
        }, 100)
      },
      hide() {
        clearTimeout(this.timer)
        this.$refs.tipBox.style.opacity = 0
        setTimeout(() => {
          this.showTip = false
        }, 100)
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../../common/styles/_vars.less';

  .tipBox {
    width: 100%;
    position: fixed;
    top: 45%;
    left: 0;
    text-align: center;
    transition: all .4s;
    opacity: 0;
    z-index: 100;
    .tip {
      background: @color-highlight-background;
      color: #fff;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 5px;
      opacity: .9;
    }
  }
</style>
