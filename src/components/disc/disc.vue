<template>
  <transition name="slide">
    <music-list :bgImage="coverImgUrl" :title="title" :songs="songs" ></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {Song} from '../../common/js/clazz'

  export default {
    computed: {
      ...mapGetters(['disc'])
    },
    data() {
      return {
        songs: [],
        title: '',
        coverImgUrl: ''
      }
    },
    created() {
      if (this.disc.id) {
        this.getDetail()
      } else {
        this.$router.push({
          name: 'recommend'
        })
      }
    },
    methods: {
      getDetail() {
        post('/playlist/detail', {
          id: this.$route.params.id
        }).then(data => {
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
