<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model.trim="query" class="box" :placeholder="placeholder" @focus="focus"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>
<script>
  import {debounce} from '../../common/js/clazz'
  import event, {EVENT_TYPES} from '../../utils/event'
  import {mapMutations} from 'vuex'

  export default {
    name: 'search-box',
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      blur() {
        this.$refs.query.blur()
        this.setFocus(false)
      },
      focus() {
        this.setFocus(true)
      },
      inputBlur() {
        this.setFocus(false)
        this.blur()
      },
      ...mapMutations({
        setFocus: 'SET_FOCUS'
      })
    },
    created() {
      this.$watch('value', (newVal, oldVal) => {
        this.query = newVal
      })
      this.$watch('query', debounce((newVal) => {
        this.$emit('input', newVal)
      }, 500))
      event.$on(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    activated() {
      event.$on(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    deactivated() {
      event.$off(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    beforeDestroy() {
      event.$off(EVENT_TYPES.inputBlur, this.inputBlur)
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: @color-highlight-background;
    border-radius: 6px;
    .icon-search{
      font-size: 24px;
      color: @color-background;
    }
    .box{
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: @color-highlight-background;
      color: @color-text;
      font-size: @font-size-medium;
      &::placeholder{
        color: @color-text-d;
      }
    }
    .icon-dismiss{
      font-size: 16px;
      color: @color-background;
    }
  }
</style>
