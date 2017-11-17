<template>
  <transition name="slide">
    <music-list :rank="true" :bgImage="image" :title="topList.topTitle" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {jsonp} from '../../utils/http'
  import {baseParams, ERR_OK} from '../../utils/config'
  import {createSong} from '../../common/js/clazz'

  export default {
    computed: {
      ...mapGetters(['topList']),
      image: {
        get() {
          if (this.songs.length) {
            return this.songs[0].image
          }
          return ''
        }
      }
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      if (this.topList.id) {
        this.getDetail()
      } else {
        this.$router.push({
          name: 'rank'
        })
      }
    },
    methods: {
      getDetail() {
        jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg', Object.assign({}, baseParams, {
          topid: this.$route.params.id,
          needNewCode: 1,
          uin: 0,
          tpl: 3,
          page: 'detail',
          type: 'top',
          platform: 'h5'
        })).then(data => {
          if (data.code === ERR_OK) {
            this.songs = this.normalizeSongs(data.songlist)
          }
        })
      },
      normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let music = item.data
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
