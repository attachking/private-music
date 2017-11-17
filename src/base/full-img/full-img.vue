<template>
  <transition name="scale">
    <div class="box" v-show="fullImg" @click.stop="hide">
      <img :src="fullImgSrc">
    </div>
  </transition>
</template>
<script>
  import event, {EVENT_TYPES} from '../../utils/event'

  export default {
    name: 'full-img',
    data() {
      return {
        fullImg: false,
        fullImgSrc: ''
      }
    },
    created() {
      event.$on(EVENT_TYPES.fullImg, this.show)
    },
    methods: {
      hide() {
        this.fullImg = false
      },
      show(src) {
        this.fullImg = !this.fullImg
        src && (this.fullImgSrc = src)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../common/styles/_vars.less';

  .box {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: @color-background-black;
    &.scale-enter-active, &.scale-leave-active {
      transition: all 0.4s;
    }
    &.scale-enter, &.scale-leave-to {
      opacity: 0;
      transform: scale(0);
    }
    img {
      width: 100%;
    }
  }
</style>
