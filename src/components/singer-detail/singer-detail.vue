<template>
  <transition name="slide">
    <music-list :bgImage="singer.avatar" :title="singer.name" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {Song} from '../../common/js/clazz'

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
        post('/singer/detail', {
          id: this.$route.params.id,
          limit: 100
        }).then(data => {
          if (data.data.code === ERR_OK) {
            this.songs = data.data.hotSongs.map(item => new Song(item))
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
