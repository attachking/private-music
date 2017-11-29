<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="true" :beforeScroll="true" @scrollToEnd="searchMore"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectSinger(item)" class="suggest-item" v-for="item in artists">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}}</p>
        </div>
      </li>
      <li @click="selectSong(item)" class="suggest-item" v-for="item in songs">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}}</p>
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
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {Song, Singer} from '../../common/js/clazz'
  import {mapActions, mapMutations} from 'vuex'

  const perpage = 30

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
      // 点击歌曲是否自动跳转至下一首(默认跳转)
      autoNext: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      result: {
        get() {
          return this.artists.concat(this.songs)
        }
      }
    },
    data() {
      return {
        hasMore: true,
        artists: [],
        songs: [],
        page: 0,
        loading: false
      }
    },
    methods: {
      searchSong(query) {
        post('/search', {
          keywords: query,
          offset: this.page,
          limit: perpage,
          type: 1
        }).then(data => {
          if (data.data.code === ERR_OK) {
            this.songs = this.songs.concat(data.data.result.songs.map(item => new Song(item)))
            this.checkHasMore(data.data.result)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      search(query) {
        Promise.all([post('/search', {
          keywords: query,
          offset: 0,
          limit: 20,
          type: 100
        }), post('/search', {
          keywords: query,
          offset: this.page,
          limit: perpage,
          type: 1
        })]).then(arr => {
          if (arr[0].data.code === ERR_OK) {
            this.artists = arr[0].data.result.artists.map(item => new Singer(item))
          }
          if (arr[1].data.code === ERR_OK) {
            this.songs = this.songs.concat(arr[1].data.result.songs.map(item => new Song(item)))
            this.checkHasMore(arr[1].data.result)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      searchMore() {
        if (!this.hasMore || this.loading) {
          return
        }
        this.loading = true
        this.page++
        this.searchSong(this.query)
      },
      listScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      checkHasMore(data) {
        this.hasMore = data.songCount >= this.songs.length
      },
      selectSong(item) {
        if (this.autoNext) {
          // 添加歌曲到下一个，但不播放
          this.addPlayList(item)
        } else {
          // 添加歌曲到下一个，并播放
          this.addSong(item)
        }
        this.$emit('select', item)
      },
      selectSinger(item) {
        this.setSinger(item)
        this.$router.push({
          name: 'searchSingerDetail',
          params: {
            id: item.id
          }
        })
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
          this.page = 0
          this.hasMore = true
          if (this.autoNext) {
            this.searchSong(newVal)
          } else {
            this.search(newVal)
          }
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
