<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" ref="sliderWrapper">
          <slider v-if="sliders.length">
            <div v-for="(val, key) in sliders">
              <a :href="val.linkUrl">
                <img :src="val.pic" @load="loadImage" :title="val.typeTitle">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(val, key) in discList" class="item" @click="itemSelect(val)">
              <div class="icon">
                <img width="60" height="60" v-lazy="val.picUrl">
              </div>
              <div class="text">
                <h2 class="name" v-html="val.name"></h2>
                <p class="desc">{{val.copywriter}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="loading">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {playListMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: 'recommend',
    mixins: [playListMixin],
    data() {
      return {
        sliders: [],
        checkLoaded: false,
        discList: [],
        loading: true
      }
    },
    methods: {
      getRecommend() {
        post('/banner', {}).then(data => {
          if (data.data.code === ERR_OK) {
            this.sliders = data.data.banners
          }
        })
      },
      loadImage() {
        if (this.checkLoaded) return
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      },
      getDiscList() {
        post('/recommend/personalized', {}).then(data => {
          if (data.data.code === ERR_OK) {
            this.discList = data.data.result
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      itemSelect(item) {
        this.setDisc(item)
        this.$router.push({
          name: 'disc',
          params: {
            id: item.id
          }
        })
      },
      handlePlayList(list) {
        this.$refs.recommend.style.bottom = list.length > 0 ? '60px' : 0
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    mounted() {
      this.getRecommend()
      this.getDiscList()
    }
  }
</script>

<style scoped lang="less">
  @import "../../common/styles/_vars.less";

  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
    }
  }
</style>
