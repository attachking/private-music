<template>
  <transition name="list-fade">
    <div class="playlist" @click="showFlag = !showFlag" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <span class="text">添加到歌单:</span>
          </h1>
        </div>
        <scroll ref="listContent" :data="userPlayList" class="list-content" :refreshDelay="refreshDelay">
          <ul>
            <li class="item" v-for="(item, index) in userPlayList" @click="selectItem(item, index)">
              <img width="40" height="40" :src="item.coverImgUrl">
              <span class="text">{{item.name}}</span>
            </li>
          </ul>
        </scroll>
        <div @click="showFlag = !showFlag" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">{{text}}</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import {post} from '../../utils/http'
  import {saveTypes} from '../../common/js/storage'
  import {ERR_OK, ERR_REFUSE} from '../../utils/config'

  export default {
    name: 'user-play-list',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      song: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        refreshDelay: 200,
        text: '添加成功!'
      }
    },
    computed: {
      ...mapGetters([
        'userPlayList'
      ]),
      showFlag: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      ...mapActions([
        'getFavoriteList',
        'setUserPlayList'
      ]),
      selectItem(item) {
        let isFavorite = item.id.toString() === localStorage.getItem(saveTypes.favoriteId).toString()
        post('/playlist/track', {
          pid: item.id,
          tracks: this.song.id,
          op: 'add'
        }).then(data => {
          if (data.data.code === ERR_OK) {
            if (isFavorite) {
              this.getFavoriteList()
            }
            this.setUserPlayList()
            this.text = '添加成功!'
            this.$refs.topTip.show()
          } else if (data.data.code === ERR_REFUSE) {
            this.text = '您已经添加过了'
            this.$refs.topTip.show()
          }
        })
      }
    },
    watch: {
      showFlag(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.listContent.refresh()
          }, 20)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active{
      transition: opacity 0.3s;
      .list-wrapper{
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to{
      opacity: 0;
      .list-wrapper{
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-highlight-background;
      .list-header{
        position: relative;
        padding: 20px 30px 10px 20px;
        .title{
          display: flex;
          align-items: center;
          .text{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
      .list-content{
        max-height: 240px;
        overflow: hidden;
        .item{
          display: flex;
          align-items: center;
          height: 40px;
          padding: 5px 30px 10px 20px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active{
            transition: all 0.1s;
          }
          &.list-enter, &.list-leave-to{
            height: 0;
          }
          .text{
            flex: 1;
            .no-wrap();
            padding: 0 0 0 10px;
            font-size: @font-size-medium;
            color: @color-theme-d;
          }
        }
      }
      .list-close{
        text-align: center;
        line-height: 50px;
        background: @color-background;
        font-size: @font-size-medium-x;
        color: @color-text-l;
      }
    }
    .tip-title {
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
  }
</style>
