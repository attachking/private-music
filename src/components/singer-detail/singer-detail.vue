<template>
  <transition name="slide">
    <music-list :bgImage="singer.avatar" :title="singer.name" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {jsonp} from '../../utils/http'
  import {baseParams, ERR_OK} from '../../utils/config'
  import {createSong} from '../../common/js/clazz'

  export default {
    computed: {
      ...mapGetters(['singer'])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      if (this.singer.id) {
        this.getDetail()
      } else {
        this.$router.push({
          name: 'singer'
        })
      }
    },
    methods: {
      getDetail() {
        jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', Object.assign({}, baseParams, {
          hostUin: 0,
          needNewCode: 0,
          platform: 'yqq',
          order: 'listen',
          begin: 0,
          num: 80,
          songstatus: 1,
          singermid: this.$route.params.id
        })).then(data => {
          if (data.code === ERR_OK) {
            this.songs = this.normalizeSongs(data.data.list)
          }
        })
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let music = item.musicData
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
