<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" v-model="query"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="searchHistory">
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
  import {playListMixin, searchMixin} from '../../common/js/mixin'

  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        query: '',
        hotKey: [],
        refreshDelay: 200
      }
    },
    watch: {
      query(newVal) {
        // 清空搜索内容时同样刷新搜索历史列表
        if (newVal === '') {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    methods: {
      handlePlayList(list) {
        const bottom = list.length > 0 ? '60px' : 0
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      }
    }
  }
</script>
<style lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .search-history {
          position: relative;
          margin: 0 20px;
          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text {
              flex: 1;
            }
            .clear {
              .extend-click();
              .icon-clear {
                font-size: @font-size-medium;
                color: @color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
