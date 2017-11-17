<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="true" :beforeScroll="true" @scrollToEnd="searchMore"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
  import {jsonp} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {createSong, Singer} from '../../common/js/clazz'
  import {mapActions, mapMutations} from 'vuex'

  const perpage = 20
  const TYPE_SINGER = 'singer'

  export default {
    name: 'suggest',
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      },
      // 点击歌曲是否自动跳转至下一首
      autoNext: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasMore: true,
        result: [],
        page: 1,
        loading: false
      }
    },
    methods: {
      search(query) {
        jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
          w: query,
          p: this.page,
          perpage: perpage,
          n: perpage,
          catZhida: this.showSinger ? 1 : 0,
          zhidaqu: 1,
          t: 0,
          flag: 1,
          ie: 'utf-8',
          sem: 1,
          aggr: 0,
          remoteplace: 'txt.mqq.all',
          uin: 0,
          needNewCode: 1,
          platform: 'h5'
        }).then(res => {
          if (res.code === ERR_OK) {
            if (res.data.song.curpage === 1) {
              this.result = this.getResult(res.data)
              this.$refs.suggest.scrollTo(0, 0)
            } else {
              this.result = this.result.concat(this.normalizeSongs(res.data.song.list))
            }
            this.checkHasMore(res.data)
            this.loading = false
          }
        })
      },
      searchMore() {
        if (!this.hasMore || this.loading) {
          return
        }
        this.loading = true
        this.page++
        this.search(this.query)
      },
      listScroll() {
        this.$emit('listScroll')
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      checkHasMore(data) {
        if (!data.song.list.length || data.song.curnum + data.song.curpage * perpage >= data.song.totalnum) {
          this.hasMore = false
        } else {
          this.hasMore = true
        }
      },
      getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, type: TYPE_SINGER})
        }
        ret = ret.concat(this.normalizeSongs(data.song.list))
        return ret
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          this.$router.push({
            name: 'searchSingerDetail',
            params: {
              id: item.singermid
            }
          })
          this.setSinger(new Singer({
            id: item.singermid,
            name: item.singername
          }))
        } else {
          if (this.autoNext) {
            this.addPlayList(item)
          } else {
            this.addSong(item)
          }
        }
        this.$emit('select', item)
      },
      ...mapActions([
        'addSong',
        'addPlayList'
      ]),
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query(newVal) {
        if (newVal !== '') {
          this.page = 1
          this.result = []
          this.hasMore = true
          this.search(newVal)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap()
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
