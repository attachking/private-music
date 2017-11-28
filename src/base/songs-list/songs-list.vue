<template>
  <div class="song-list">
    <transition-group name="list" tag="ul">
      <li :key="song.id" class="item" v-for="(song, index) in songs" @click="selectItem(song, index)" @transitionend="transitionend">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
        <div v-if="del" class="delete" @click.stop="selectDel(song, index)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </transition-group>
  </div>
</template>
<script>
  export default {
    name: 'songs-list',
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      },
      del: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isEnd: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}·${song.album}`
      },
      selectItem(song, index) {
        this.$emit('select', song, index)
      },
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1
        } else {
          return ''
        }
      },
      selectDel(song, index) {
        this.$emit('delete', song, index)
      },
      transitionend() {
        // 过渡效果完毕后派发事件
        if (this.isEnd) return
        this.$emit('end')
        this.isEnd = true
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .song-list{
    .item{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: @font-size-medium;
      &.list-enter-active, &.list-leave-active{
        transition: all 0.1s;
      }
      &.list-enter, &.list-leave-to{
        height: 0;
      }
      .rank{
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .icon{
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0{
            .bg-image('../../base/songs-list/first');
          }
          &.icon1{
            .bg-image('../../base/songs-list/second');
          }
          &.icon2{
            .bg-image('../../base/songs-list/third');
          }
        }
        .text{
          color: @color-theme;
          font-size: @font-size-large;
        }
      }
      .content{
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          .no-wrap();
          color: @color-text;
        }
        .desc{
          .no-wrap();
          margin-top: 4px;
          color: @color-text-d;
        }
      }
      .delete{
        flex: 0 0 20px;
      }
    }
  }
</style>
