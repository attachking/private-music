<template>
  <transition name="slide">
    <music-list :rank="true" :bgImage="image" :title="title" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {Song} from '../../common/js/clazz'

  export default {
    computed: {
      ...mapGetters(['topList'])
    },
    data() {
      return {
        songs: [],
        image: '',
        title: ''
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
        post('/playlist/detail', {
          id: this.$route.params.id
        }).then(data => {
          if (data.data.code === ERR_OK) {
            this.title = data.data.playlist.name
            this.songs = data.data.playlist.tracks.map(item => new Song(item))
            this.image = data.data.playlist.coverImgUrl
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
