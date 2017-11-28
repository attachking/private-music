<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="topList">
      <div class="recommend-list">
        <h1 class="list-title">精品歌单</h1>
        <ul>
          <li v-for="(val, key) in topList" class="item" @click="selectItem(val)">
            <div class="icon">
              <img width="60" height="60" v-lazy="val.coverImgUrl">
            </div>
            <div class="text">
              <h2 class="name" v-html="val.name"></h2>
              <p class="desc">{{val.copywriter}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import {playListMixin} from '../../common/js/mixin'
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this.getTopList()
    },
    methods: {
      getTopList() {
        post('/playlist/highQuality', {}).then(res => {
          if (res.data.code === ERR_OK) {
            this.topList = res.data.playlists
          }
        })
      },
      handlePlayList(list) {
        this.$refs.rank.style.bottom = list.length > 0 ? '60px' : 0
        this.$refs.topList.refresh()
      },
      selectItem(item) {
        this.setTopList(item)
        this.$router.push({
          name: 'topList',
          params: {
            id: item.id
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .toplist {
      height: 100%;
      overflow: hidden;
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
