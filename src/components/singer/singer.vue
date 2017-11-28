<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @select="select" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
  import {post} from '../../utils/http'
  import {Singer} from '../../common/js/clazz'
  import {mapMutations} from 'vuex'
  import {playListMixin} from '../../common/js/mixin'
  import {ERR_OK} from '../../utils/config'
  import code from '../../common/js/characters-letter'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: 'singer',
    mixins: [playListMixin],
    data() {
      return {
        search: {
          limit: 100,
          offset: 0
        },
        singerList: []
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      select(singer) {
        this.$router.push({
          name: 'singerDetail',
          params: {
            id: singer.id
          }
        })
        this.setSinger(singer)
      },
      getSingerList() {
        post('/singer/list', this.search).then(data => {
          if (data.data.code === ERR_OK) {
            this.normalSingerList(data.data.artists)
          }
        })
      },
      normalSingerList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url
            }))
          }
          let key = code(item.name.charAt(0)).toUpperCase()
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url
          }))
        })
        let nor = []
        let hots = []
        for (let i in map) {
          if (/[a-zA-Z]/.test(map[i].title)) {
            nor.push(map[i])
          } else if (map[i].title === HOT_NAME) {
            hots.push(map[i])
          }
        }
        nor.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        this.singerList = hots.concat(nor)
      },
      handlePlayList(playList) {
        this.$refs.singer.style.bottom = playList.length > 0 ? '60px' : 0
        this.$refs.list.refresh()
      }
    },
    mounted() {
      this.getSingerList()
    }
  }
</script>
<style scoped lang="less">
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
