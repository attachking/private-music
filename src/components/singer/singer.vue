<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @select="setSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
  import {jsonp} from '../../utils/http'
  import {Singer} from '../../common/js/clazz'
  import {mapMutations} from 'vuex'
  import {playListMixin} from '../../common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: 'singer',
    mixins: [playListMixin],
    data() {
      return {
        search: {
          pagesize: 100,
          pagenum: 1
        },
        singerList: []
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      getSingerList() {
        jsonp('https://c.y.qq.com/v8/fcg-bin/v8.fcg', Object.assign({
          channel: 'singer',
          page: 'list',
          key: 'all_all_all',
          hostUin: 0,
          needNewCode: 0,
          platform: 'yqq'
        }, this.search)).then(data => {
          this.normalSingerList(data.data.list)
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
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
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
