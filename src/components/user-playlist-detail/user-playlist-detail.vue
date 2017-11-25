<template>
  <transition name="slide">
    <music-list :bgImage="coverImgUrl" :title="title" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {post} from '../../utils/http'
  import {baseParams, ERR_OK} from '../../utils/config'
  import {Song} from '../../common/js/clazz'

  export default {
    data() {
      return {
        songs: [],
        title: '',
        coverImgUrl: ''
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        post('/playlist/detail', Object.assign({}, baseParams, {
          id: this.$route.params.id
        })).then(data => {
          if (data.data.code === ERR_OK) {
            this.title = data.data.playlist.name
            this.coverImgUrl = data.data.playlist.coverImgUrl
            this.songs = data.data.playlist.tracks.map(item => {
              return new Song(item)
            })
          }
        })
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
