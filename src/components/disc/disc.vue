<template>
  <transition name="slide">
    <music-list :bgImage="disc.imgurl" :title="disc.dissname" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {post} from '../../utils/http'
  import {baseParams, ERR_OK} from '../../utils/config'
  import {createSong} from '../../common/js/clazz'

  export default {
    computed: {
      ...mapGetters(['disc'])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      if (this.disc.dissid) {
        this.getDetail()
      } else {
        this.$router.push({
          name: 'recommend'
        })
      }
    },
    methods: {
      getDetail() {
        post('/users/agent', Object.assign({}, baseParams, {
          disstid: this.$route.params.id,
          type: 1,
          json: 1,
          utf8: 1,
          onlysong: 0,
          platform: 'yqq',
          hostUin: 0,
          needNewCode: 0,
          format: 'json',
          url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
          method: 'get',
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        })).then(data => {
          if (data.code === ERR_OK) {
            this.songs = this.normalizeSongs(data.cdlist[0].songlist)
          }
        })
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach(music => {
          if (music.songid && music.albummid) {
            ret.push(createSong(music))
          }
        })
        return ret
      }
    }
  }
</script>
<style scoped lang="less">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
